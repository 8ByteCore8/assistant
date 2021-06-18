import { ObjectSchema } from "joi";
import ViewValidator from "./view.validator";

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

export const Validators = {
    "viewValidator": new ViewValidator(),
};