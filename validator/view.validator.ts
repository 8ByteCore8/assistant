import Joi from "joi";
import { Validator } from ".";

type Input = {

};

export default class ViewValidator extends Validator<Input>{
    protected validator: () => Promise<boolean>;
    inputSchema = Joi.object();
}