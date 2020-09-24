import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { DateTimePicker } from 'react-widgets'
import { Form, FormFieldProps, Label, Select } from 'semantic-ui-react'

interface IProps extends FieldRenderProps<Date, HTMLInputElement>, FormFieldProps {}

const DateInput: React.FC<IProps> = ({
    input,
    width,
    placeholder,
    date = false,
    time = false,
    meta: { touched, error },
    ...rest
}) => {
    return (
        <Form.Field error={touched && !!error} width={width}>
            <DateTimePicker 
                placeholder={placeholder}
                value={input.value || null}
                onChange={input.onChange}
                time={time}
                date={date}
            />
            {touched && error && (
                <Label basic color='red'>
                    {error}
                </Label>
            )}
        </Form.Field>
    )
}

export default DateInput
