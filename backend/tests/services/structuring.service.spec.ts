import { describe, it, expect, vi, beforeEach } from 'vitest';

const createMock = vi.fn();

vi.mock('../../src/config/openai', () => ({
  getOpenAI: () => ({
    chat: {
      completions: {
        create: createMock,
      },
    },
  }),
}));

const VALID_JSON = {
  id: 'reg-1',
  nameAr: 'لائحة شؤون الموظفين',
  nameEn: 'Employee Affairs Regulation',
  descriptionAr: 'وصف',
  descriptionEn: 'Description',
  regulationTypes: [
    {
      id: 'type-1',
      nameAr: 'لائحة الحضور',
      nameEn: 'Attendance',
      regulationId: 'reg-1',
      regulationActions: [
        {
          id: 'act-1',
          actionAr: 'تأخير بدون عذر',
          actionEn: 'Unexcused Delay',
          actionType: 'Penalty',
          penaltyValueType: 'Amount',
          additionValueType: null,
          textValue: null,
          decimalValue: 15,
          daysValue: null,
          percentageValue: null,
        },
      ],
    },
  ],
};

describe('structureDocument', () => {
  beforeEach(() => {
    createMock.mockReset();
  });

  it('normalizes LLM JSON output into the internal schema', async () => {
    createMock.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(VALID_JSON) } }],
    } as never);

    const { structureDocument } = await import('../../src/services/structuring.service');
    const result = await structureDocument('some regulation text', 'doc-123');
    expect(result.document_id).toBe('doc-123');
    expect(result.name_ar).toBe('لائحة شؤون الموظفين');
    expect(result.regulationTypes).toHaveLength(1);
    expect(result.regulationTypes[0].regulationActions[0].decimal_value).toBe(15);
  });

  it('throws AppError when LLM returns malformed JSON', async () => {
    createMock.mockResolvedValueOnce({
      choices: [{ message: { content: 'not json at all' } }],
    } as never);

    const { structureDocument } = await import('../../src/services/structuring.service');
    await expect(structureDocument('text', 'doc-1')).rejects.toMatchObject({
      code: 'STRUCTURING_ERROR',
    });
  });
});
