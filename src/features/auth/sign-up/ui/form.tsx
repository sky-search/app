import { notifyError, notifySuccess } from "@/services/notification"
import { Button } from "@/shared/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { PhoneInput } from "@/shared/ui/phone-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { useForm } from "@tanstack/react-form"
import { useNavigate } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import { signUpFn } from "../api/mutation"
import { signUpPayloadSchema } from "../model/schema"
import type { SignUpPayload } from "../model/types"

const defaultFormValues: SignUpPayload = {
  email: "",
  password: "",
  preferred_currency: "USD",
  preferred_language: "en",
}

export function SignUpForm() {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()
  const serverFn = useServerFn(signUpFn)
  const form = useForm({
    defaultValues: defaultFormValues,
    onSubmit: async ({ value }) => {
      const response = await serverFn({
        data: {
          email: value.email,
          password: value.password,
          full_name: value.full_name,
          preferred_currency: value.preferred_currency,
          preferred_language: value.preferred_language,
        },
      })
      if (response.success === false) {
        return notifyError("Failed to sign up!", {
          description: response.error.message,
        })
      }
      notifySuccess("Successfully signed up!")
      navigate({
        to: "/auth/login",
      })
      form.reset()
    },
    validators: {
      onSubmit: signUpPayloadSchema,
      onChange: signUpPayloadSchema,
      onBlur: signUpPayloadSchema,
    },
    canSubmitWhenInvalid: true,
    asyncAlways: true,
  })

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  type="email"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <form.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <div className="w-full space-y-1">
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={isVisible ? "text" : "password"}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="••••••••••••••••"
                      className="pr-9"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsVisible((prevState) => !prevState)}
                      className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                    >
                      {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                      <span className="sr-only">
                        {isVisible ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              </div>
            )
          }}
        />
        <form.Field
          name="full_name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <form.Field
          name="phone"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Phone number</FieldLabel>
                <PhoneInput
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <form.Field
          name="preferred_language"
          children={(field) => {
            const spokenLanguages = [
              { label: "English", value: "en" },
              { label: "O'zbekcha", value: "uz" },
              { label: "Русский", value: "ru" },
            ] as const
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field orientation="responsive" data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>
                    Preferred Language
                  </FieldLabel>
                  <FieldDescription>
                    For best results, select the language you speak.
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldContent>
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value ?? "")}
                  items={spokenLanguages}
                >
                  <SelectTrigger
                    className="min-w-[120px]"
                    id={field.name}
                    aria-invalid={isInvalid}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {spokenLanguages.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )
          }}
        />
      </FieldGroup>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button className="w-full" type="submit" disabled={!canSubmit}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            Sign up
          </Button>
        )}
      />
    </form>
  )
}
