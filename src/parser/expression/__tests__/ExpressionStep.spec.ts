import { describe, expect, it } from 'vitest'
import { StepExpressionMatchError } from '../../../errors/errors'
import { Step, StepTypes } from '../../models/step'
import { ExpressionStep } from '../ExpressionStep'

describe(`ExpressionStep`, () => {
    describe('{string}', () => {
        it(`should match {string}`, () => {
            const step = new Step(StepTypes.GIVEN, `I love 'Vue'`)
            const params = ExpressionStep.matchStep(step, `I love {string}`)
            expect(params).toEqual([`Vue`])
        })

        it(`should match multiple {string}`, () => {
            const step = new Step(StepTypes.GIVEN, `I love 'Vue' for "web"`)
            const params = ExpressionStep.matchStep(
                step,
                `I love {string} for {string}`,
            )
            expect(params).toEqual([`Vue`, `web`])
        })
    })

    describe('{number}', () => {
        it(`should match {number}`, () => {
            const step = new Step(StepTypes.GIVEN, `I love Vue 3`)
            const params = ExpressionStep.matchStep(step, `I love Vue {number}`)
            expect(params).toEqual([3])
        })

        it.skip(`should match multiple {number}`, () => {
            const step = new Step(StepTypes.GIVEN, `I love Vue 3.1 or 3.2`)
            const params = ExpressionStep.matchStep(
                step,
                `I love Vue {number} or {number}`,
            )
            expect(params).toEqual([3.1, 3.2])
        })
    })

    describe('{float}', () => {
        it(`should match {float}`, () => {
            const step = new Step(StepTypes.GIVEN, `I love Vue 3.1`)
            const params = ExpressionStep.matchStep(step, `I love Vue {float}`)
            expect(params).toEqual([3.1])
        })

        it(`should match multiple {float}`, () => {
            const step = new Step(StepTypes.GIVEN, `I love Vue 3.1 or 3.2`)
            const params = ExpressionStep.matchStep(
                step,
                `I love Vue {float} or {float}`,
            )
            expect(params).toEqual([3.1, 3.2])
        })
    })

    describe('{list}', () => {
        it(`should match {list}`, () => {
            const step = new Step(
                StepTypes.GIVEN,
                `I use React, Astro, TypeScript`,
            )
            const params = ExpressionStep.matchStep(step, `I use {list}`)
            const expectedList = ['React', 'Astro', 'TypeScript']

            expect(params).toEqual([expectedList])
        })

        it(`should match multiple {list}`, () => {
            const step = new Step(
                StepTypes.GIVEN,
                `I use React, Astro, TypeScript and I also use Vue, Svelte, Angular`,
            )
            const params = ExpressionStep.matchStep(
                step,
                `I use {list} and I also use {list}`,
            )
            const expectedList1 = ['React', 'Astro', 'TypeScript']
            const expectedList2 = ['Vue', 'Svelte', 'Angular']

            expect(params).toEqual([expectedList1, expectedList2])
        })
    })

    it(`should match both {string} and {number}`, () => {
        const step = new Step(StepTypes.GIVEN, `I love "Vue" 3 and 12`)
        const params = ExpressionStep.matchStep(
            step,
            `I love {string} {number} and {number}`,
        )
        expect(params).toEqual([`Vue`, 3, 12])
    })

    it(`should detect wrong expression`, () => {
        const step = new Step(StepTypes.GIVEN, `I love "Vue" 3`)

        expect(() => {
            ExpressionStep.matchStep(step, `I love {number} 3`)
        }).toThrowError(new StepExpressionMatchError(step, `I love {number} 3`))
    })

    it(`should detect step without expression`, () => {
        const step = new Step(StepTypes.GIVEN, `I love "Vue" 3`)
        const params = ExpressionStep.matchStep(step, `I love "Vue" 3`)

        expect(params).toEqual([])
    })
})
