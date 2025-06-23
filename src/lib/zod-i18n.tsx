import { createTranslator } from 'next-intl';
import type { ZodErrorMap } from 'zod';

export const zodI18nMap = (t: ReturnType<typeof createTranslator>): ZodErrorMap => {
    return (issue, ctx) => {
        switch (issue.code) {
            case 'invalid_type':
                return {
                    message: t('form.errors.invalidType', {
                        expected: t(`form.types.${issue.expected}`),
                        received: t(`form.types.${issue.received}`),
                    }),
                };

            case 'too_small':
                return {
                    message: t(`form.errors.tooSmall.${issue.type}`, {
                        minimum: Number(issue.minimum),
                        count: Number(issue.minimum),
                    }),
                };

            case 'too_big':
                return {
                    message: t(`form.errors.tooBig.${issue.type}`, {
                        maximum: Number(issue.maximum),
                        count: Number(issue.maximum),
                    }),
                };

            case 'invalid_literal':
                return {
                    message: t('form.errors.invalidLiteral', {
                        expected: JSON.stringify(issue.expected),
                    }),
                };

            case 'unrecognized_keys':
                return {
                    message: t('form.errors.unrecognizedKeys'),
                };

            case 'invalid_enum_value':
                return {
                    message: t('form.errors.invalidEnumValue', {
                        options: issue.options.join(', '),
                    }),
                };

            case 'invalid_union':
            case 'invalid_union_discriminator':
                return {
                    message: t('form.errors.invalidUnion'),
                };

            case 'invalid_date':
                return {
                    message: t('form.errors.invalidDate'),
                };

            case 'invalid_string':
                return {
                    message: t(`form.errors.invalidString.${issue.validation}`) ||
                        t('form.errors.invalidString.default'),
                };

            case 'too_small':
                return {
                    message: t(`form.errors.tooSmall.${issue.type}`, {
                        minimum: Number(issue.minimum),
                        count: Number(issue.minimum),
                    }),
                };

            case 'too_big':
                return {
                    message: t(`form.errors.tooBig.${issue.type}`, {
                        maximum: Number(issue.maximum),
                        count: Number(issue.maximum),
                    }),
                };

            case 'custom':
                return {
                    message: ctx.defaultError,
                };

            default:
                return {
                    message: t('form.errors.default'),
                };
        }
    };
};
