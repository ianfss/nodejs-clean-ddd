import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from '../../../../../test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from '../../../../../test/factories/make-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('1'),
      }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('1'),
      }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('1'),
      }),
    )

    const result = await sut.execute({
      questionId: '1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated question comments', async () => {
    Array.from({ length: 22 }).forEach(() => {
      inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('1'),
        }),
      )
    })

    const result = await sut.execute({
      questionId: '1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(2)
  })
})
