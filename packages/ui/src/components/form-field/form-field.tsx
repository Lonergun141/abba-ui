"use client";

import * as React from "react";

import { cn } from "../../utilities/cn";
import { FormMessage } from "../form-message/form-message";
import { Label } from "../label/label";
import styles from "./form-field.module.css";

export interface FormFieldProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  /** Visible caption for the control. */
  label?: React.ReactNode;
  /** Helper text describing the expected input. */
  description?: React.ReactNode;
  /** Validation failure. Its presence puts the control into the invalid state. */
  error?: React.ReactNode;
  /** Marks the control as required, both visually and via the child's props. */
  required?: boolean;
  /** Dims the label and disables the control. */
  disabled?: boolean;
  /**
   * The form control. Exactly one element.
   *
   * Its `id`, `aria-describedby`, `aria-invalid`, `required` and `disabled`
   * props are supplied automatically. Anything you set explicitly wins.
   */
  children: React.ReactElement;
}

/** Props FormField injects into its child control. */
interface InjectedControlProps {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Binds a label, helper text and error message to a single form control.
 *
 * The value of this component is the wiring, not the layout: it generates
 * stable ids and connects them through `htmlFor` and `aria-describedby`, which
 * is the part hand-written forms almost always get wrong. Screen-reader users
 * hear the label, then the description, then the error, on focus.
 */
export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  function FormField(
    {
      label,
      description,
      error,
      required = false,
      disabled = false,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    // useId is SSR-safe and produces the same value on server and client, so
    // the label/control association survives hydration.
    const generatedId = React.useId();
    const control = React.Children.only(children) as React.ReactElement<
      InjectedControlProps & Record<string, unknown>
    >;

    const controlId = control.props.id ?? `${generatedId}-control`;
    const descriptionId = `${generatedId}-description`;
    const errorId = `${generatedId}-error`;

    const describedBy =
      [description ? descriptionId : null, error ? errorId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    const clonedControl = React.cloneElement(control, {
      id: controlId,
      // Preserve anything the consumer set explicitly rather than overwriting
      // it — a hand-supplied aria-describedby is a deliberate choice.
      "aria-describedby": control.props["aria-describedby"] ?? describedBy,
      "aria-invalid": control.props["aria-invalid"] ?? (error ? true : undefined),
      invalid: control.props.invalid ?? (error ? true : undefined),
      required: control.props.required ?? (required || undefined),
      disabled: control.props.disabled ?? (disabled || undefined),
    });

    return (
      <div ref={ref} className={cn(styles.root, className)} {...rest}>
        {label ? (
          <Label htmlFor={controlId} required={required} disabled={disabled}>
            {label}
          </Label>
        ) : null}

        {clonedControl}

        {description ?? error ? (
          <div className={styles.messages}>
            {description ? (
              <FormMessage id={descriptionId} tone="description">
                {description}
              </FormMessage>
            ) : null}
            {error ? (
              <FormMessage id={errorId} tone="error">
                {error}
              </FormMessage>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
);

FormField.displayName = "FormField";
