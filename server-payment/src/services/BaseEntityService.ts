import { injectable } from "inversify";
import { chain } from "lodash";
import { isDefined } from "../utilities/helpers";
import { Validator } from "../models/Validator";

@injectable()
export abstract class BaseEntityService<Creator> {
  protected abstract creatorValidator: Validator<Creator>;

  protected validate = async (input: Creator) => {
    const promises = Object.entries(this.creatorValidator).map(([field, validationFunction]) => {
      const value = (input as any)[field].toString();
      return (validationFunction as any)(value);
    });

    const results = await Promise.all(promises);

    const errors = chain(results)
      .filter(isDefined)
      .flatten()
      .value();

    if (errors.length === 0) return null;
    return errors;
  };
}
