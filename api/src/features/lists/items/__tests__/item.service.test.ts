import { describe, expect, it, vi } from 'vitest';
import { NotFoundError } from '../../../../errors/NotFoundError.js';
import { VocabularyItemStatus } from '../../../../generated/prisma/enums.js';
import listRepository from '../../list.repository.js';
import listItemRepository from '../item.repository.js';
import listItemService from '../item.service.js';

vi.mock('../../list.repository.js', () => ({
  default: {
    findVocabListByUser: vi.fn(),
  },
}));

vi.mock('../item.repository.js', () => ({
  default: {
    findVocabListItemsByListId: vi.fn(),
    findVocabListItemByListId: vi.fn(),
    findVocabListItemById: vi.fn(),
    addVocabListItem: vi.fn(),
    updateVocabListItemStatus: vi.fn(),
    deleteVocabListItem: vi.fn(),
  },
}));

const mockList = {
  id: 'list-id-001',
  userId: 'user-id-001',
  name: 'Test List',
  sourceLanguageId: null,
  targetLanguageId: null,
  sourceLanguageCode: 'en',
  targetLanguageCode: 'de',
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockItem = {
  id: 'item-id-001',
  listId: 'list-id-001',
  sourceText: 'apple',
  targetText: 'Apfel',
  position: 1,
  status: VocabularyItemStatus.LEARNING,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('listItemService.addVocabListItem', () => {
  it('creates item at position 1 when list is empty', async () => {
    vi.mocked(listRepository.findVocabListByUser).mockResolvedValueOnce(mockList);
    vi.mocked(listItemRepository.findVocabListItemsByListId).mockResolvedValueOnce([]);
    vi.mocked(listItemRepository.addVocabListItem).mockResolvedValueOnce(mockItem);

    const result = await listItemService.addVocabListItem('user-id-001', 'list-id-001', {
      sourceText: 'apple',
      targetText: 'Apfel',
    });

    expect(listItemRepository.addVocabListItem).toHaveBeenCalledWith({
      listId: mockList.id,
      sourceText: 'apple',
      targetText: 'Apfel',
      position: 1,
    });
    expect(result).toMatchObject({ id: mockItem.id, position: 1 });
  });

  it('creates item at position count + 1 when items already exist', async () => {
    const existingItems = [
      mockItem,
      { ...mockItem, id: 'item-id-002', position: 2 },
    ];
    vi.mocked(listRepository.findVocabListByUser).mockResolvedValueOnce(mockList);
    vi.mocked(listItemRepository.findVocabListItemsByListId).mockResolvedValueOnce(existingItems);
    vi.mocked(listItemRepository.addVocabListItem).mockResolvedValueOnce({
      ...mockItem,
      id: 'item-id-003',
      position: 3,
    });

    await listItemService.addVocabListItem('user-id-001', 'list-id-001', {
      sourceText: 'book',
      targetText: 'Buch',
    });

    expect(listItemRepository.addVocabListItem).toHaveBeenCalledWith({
      listId: mockList.id,
      sourceText: 'book',
      targetText: 'Buch',
      position: 3,
    });
  });

  it('throws when list does not belong to user', async () => {
    vi.mocked(listRepository.findVocabListByUser).mockRejectedValueOnce(
      new NotFoundError('Vocabulary List for this User does not exist'),
    );

    await expect(
      listItemService.addVocabListItem('other-user-id', 'list-id-001', {
        sourceText: 'apple',
        targetText: 'Apfel',
      }),
    ).rejects.toThrow('Vocabulary List for this User does not exist');
  });
});

describe('listItemService.updateVocabListItemStatus', () => {
  it('changes status from LEARNING to MASTERED', async () => {
    vi.mocked(listRepository.findVocabListByUser).mockResolvedValueOnce(mockList);
    vi.mocked(listItemRepository.findVocabListItemByListId).mockResolvedValueOnce(mockItem);
    vi.mocked(listItemRepository.updateVocabListItemStatus).mockResolvedValueOnce({
      ...mockItem,
      status: VocabularyItemStatus.MASTERED,
    });

    const result = await listItemService.updateVocabListItemStatus(
      'user-id-001',
      'list-id-001',
      'item-id-001',
      VocabularyItemStatus.MASTERED,
    );

    expect(listItemRepository.updateVocabListItemStatus).toHaveBeenCalledWith(
      mockItem.id,
      VocabularyItemStatus.MASTERED,
    );
    expect(result.status).toEqual(VocabularyItemStatus.MASTERED);
  });

  it('changes status from MASTERED back to LEARNING', async () => {
    const masteredItem = { ...mockItem, status: VocabularyItemStatus.MASTERED };
    vi.mocked(listRepository.findVocabListByUser).mockResolvedValueOnce(mockList);
    vi.mocked(listItemRepository.findVocabListItemByListId).mockResolvedValueOnce(masteredItem);
    vi.mocked(listItemRepository.updateVocabListItemStatus).mockResolvedValueOnce({
      ...mockItem,
      status: VocabularyItemStatus.LEARNING,
    });

    const result = await listItemService.updateVocabListItemStatus(
      'user-id-001',
      'list-id-001',
      'item-id-001',
      VocabularyItemStatus.LEARNING,
    );

    expect(listItemRepository.updateVocabListItemStatus).toHaveBeenCalledWith(
      mockItem.id,
      VocabularyItemStatus.LEARNING,
    );
    expect(result.status).toEqual(VocabularyItemStatus.LEARNING);
  });

  it('rejects when the list is not owned by the user', async () => {
    vi.mocked(listRepository.findVocabListByUser).mockRejectedValueOnce(
      new NotFoundError('Vocabulary List for this User does not exist'),
    );

    await expect(
      listItemService.updateVocabListItemStatus(
        'other-user-id',
        'list-id-001',
        'item-id-001',
        VocabularyItemStatus.MASTERED,
      ),
    ).rejects.toThrow('Vocabulary List for this User does not exist');
  });

  it('rejects when the item is not in the verified list', async () => {
    vi.mocked(listRepository.findVocabListByUser).mockResolvedValueOnce(mockList);
    vi.mocked(listItemRepository.findVocabListItemByListId).mockRejectedValueOnce(
      new NotFoundError('Vocabulary List Item does not exist in this list'),
    );

    await expect(
      listItemService.updateVocabListItemStatus(
        'user-id-001',
        'list-id-001',
        'other-item-id',
        VocabularyItemStatus.MASTERED,
      ),
    ).rejects.toThrow('Vocabulary List Item does not exist in this list');
  });
});
