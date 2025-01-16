import IGroupActivity from "./GroupActivity"
import IIndividualActivity from "./IndividualActivity"


interface IActivityResponse{
    groupData: {[key: string]: IGroupActivity},
    individualData: IIndividualActivity[]
}
export default IActivityResponse