import { ObjectSchema } from "joi";
import ViewValidator from "./view.validator";


export const Validators = {
    "ViewValidator": new ViewValidator(),
};


export abstract class Validator<Input>  {
    protected abstract inputSchema: ObjectSchema;
    protected abstract validator: () => Promise<boolean>;

    public input: Input;
    public correct: boolean;


    public async validate(input: Object) {
        this.input = await this.inputSchema.validateAsync(input, {
            convert: true,
            stripUnknown: true
        });

        this.correct = await this.validator();
    }
};