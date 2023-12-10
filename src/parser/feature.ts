import {
    Example, Scenario, ScenarioOutline, 
} from './scenario'

export class Feature {

    public readonly name : string

    public readonly scenarii : Scenario[] = []

    public constructor (name : string) {
        this.name = name
    }

    public getScenarioByName (name : string) : Scenario | undefined {
        return this.scenarii.find((s : Scenario) => {
            return s.description === name
        })
    }

    public isOutline (name : string) : boolean {
        const scenario = this.getScenarioByName(name)
        return scenario instanceof ScenarioOutline
    }

    public getScenarioExample (name : string) : Example | null {
        const scenario = this.getScenarioByName(name)

        if (scenario instanceof ScenarioOutline) {
            return scenario.examples
        }

        return null
    }

    public getFirstNotCalledScenario () : Scenario | ScenarioOutline | undefined {
        return this.scenarii.find((scenario : Scenario) => {
            return scenario.isCalled === false
        })
    }

    public haveAlreadyCalledScenario () : boolean {
        return this.scenarii
            .filter((scenario : Scenario) => scenario.isCalled === true)
            .length > 0
    }

}
