import OpenAI from 'openai';
import { config } from '../config';
import { getOpenAI } from '../config/openai';
import { AppError, ErrorCode } from '../models/errors';
import { StructuredRegulation } from '../models';

const JSON_SCHEMA: OpenAI.ResponseFormatJSONSchema['json_schema'] = {
  name: 'structured_regulation',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      nameAr: { type: 'string' },
      nameEn: { type: 'string' },
      descriptionAr: { type: 'string' },
      descriptionEn: { type: 'string' },
      regulationTypes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nameAr: { type: 'string' },
            nameEn: { type: 'string' },
            regulationId: { type: 'string' },
            regulationActions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  actionAr: { type: 'string' },
                  actionEn: { type: 'string' },
                  actionType: { type: 'string', enum: ['Penalty', 'Addition'] },
                  penaltyValueType: {
                    type: ['string', 'null'],
                    enum: ['Amount', 'Text', 'Days', 'Percentage', null],
                  },
                  additionValueType: {
                    type: ['string', 'null'],
                    enum: ['Amount', 'Text', 'Days', 'Percentage', null],
                  },
                  textValue: { type: ['string', 'null'] },
                  decimalValue: { type: ['number', 'null'] },
                  daysValue: { type: ['number', 'null'] },
                  percentageValue: { type: ['number', 'null'] },
                },
                required: [
                  'id',
                  'actionAr',
                  'actionEn',
                  'actionType',
                  'penaltyValueType',
                  'additionValueType',
                  'textValue',
                  'decimalValue',
                  'daysValue',
                  'percentageValue',
                ],
                additionalProperties: false,
              },
            },
          },
          required: ['id', 'nameAr', 'nameEn', 'regulationId', 'regulationActions'],
          additionalProperties: false,
        },
      },
    },
    required: ['id', 'nameAr', 'nameEn', 'descriptionAr', 'descriptionEn', 'regulationTypes'],
    additionalProperties: false,
  },
};

const STRUCTURING_PROMPT = `You are a document structuring assistant for HR regulations.
Extract a single regulation from the provided document text. The regulation may contain multiple
regulation types (e.g., attendance, leaves, penalties) and each type may contain actions with
penalty or addition values.

Rules:
- Generate a new UUID-style id for every object (id, regulationId, type ids, action ids).
- nameAr/nameEn must be bilingual. If a translation is not present in the source, produce a faithful translation.
- For each action, set actionType to "Penalty" or "Addition". Set exactly one value type
  (penaltyValueType for penalties, additionValueType for additions) among "Amount", "Text",
  "Days", "Percentage" and fill the matching value field (decimalValue, textValue, daysValue,
  percentageValue). Leave the others null.
- If the text does not contain regulation content, return an empty regulationTypes array.`;

interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

async function requestStructuredOutput(messages: ChatMessage[]): Promise<string> {
  const client = getOpenAI();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.aiTimeoutMs);

  try {
    const response = await client.chat.completions.create(
      {
        model: config.ai.model,
        messages,
        response_format: { type: 'json_schema', json_schema: JSON_SCHEMA },
      },
      { signal: controller.signal },
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new AppError(ErrorCode.STRUCTURING_ERROR, 'LLM returned empty structured output', 502);
    }
    return content;
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    if (err instanceof Error && err.name === 'AbortError') {
      throw new AppError(ErrorCode.TIMEOUT, 'Structuring request timed out', 408);
    }
    throw new AppError(ErrorCode.STRUCTURING_ERROR, 'LLM structuring failed', 502, {
      cause: err instanceof Error ? err.message : String(err),
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function structureDocument(
  rawText: string,
  documentId: string,
): Promise<StructuredRegulation> {
  const jsonText = await requestStructuredOutput([
    { role: 'system', content: STRUCTURING_PROMPT },
    { role: 'user', content: rawText },
  ]);

  try {
    const parsed = JSON.parse(jsonText) as Record<string, unknown>;
    return normalizeStructuredData(parsed, documentId);
  } catch (err) {
    throw new AppError(ErrorCode.STRUCTURING_ERROR, 'LLM returned malformed JSON', 502, {
      cause: err instanceof Error ? err.message : String(err),
    });
  }
}

function normalizeStructuredData(
  input: Record<string, unknown>,
  documentId: string,
): StructuredRegulation {
  return {
    id: String(input.id ?? crypto.randomUUID()),
    document_id: documentId,
    name_ar: String(input.nameAr ?? ''),
    name_en: String(input.nameEn ?? ''),
    description_ar: (input.descriptionAr as string | null) ?? null,
    description_en: (input.descriptionEn as string | null) ?? null,
    regulationTypes: Array.isArray(input.regulationTypes)
      ? input.regulationTypes.map((rt) => normalizeRegulationType(rt as Record<string, unknown>))
      : [],
  };
}

function normalizeRegulationType(
  input: Record<string, unknown>,
): StructuredRegulation['regulationTypes'][number] {
  return {
    id: String(input.id ?? crypto.randomUUID()),
    regulation_id: String(input.regulationId ?? ''),
    name_ar: String(input.nameAr ?? ''),
    name_en: String(input.nameEn ?? ''),
    regulationActions: Array.isArray(input.regulationActions)
      ? input.regulationActions.map((a) => normalizeRegulationAction(a as Record<string, unknown>))
      : [],
  };
}

function normalizeRegulationAction(
  input: Record<string, unknown>,
): StructuredRegulation['regulationTypes'][number]['regulationActions'][number] {
  return {
    id: String(input.id ?? crypto.randomUUID()),
    type_id: '',
    action_ar: String(input.actionAr ?? ''),
    action_en: String(input.actionEn ?? ''),
    action_type: input.actionType === 'Addition' ? 'Addition' : 'Penalty',
    penalty_value_type:
      (input.penaltyValueType as 'Amount' | 'Text' | 'Days' | 'Percentage' | null) ?? null,
    addition_value_type:
      (input.additionValueType as 'Amount' | 'Text' | 'Days' | 'Percentage' | null) ?? null,
    text_value: (input.textValue as string | null) ?? null,
    decimal_value: typeof input.decimalValue === 'number' ? input.decimalValue : null,
    days_value: typeof input.daysValue === 'number' ? input.daysValue : null,
    percentage_value: typeof input.percentageValue === 'number' ? input.percentageValue : null,
  };
}
