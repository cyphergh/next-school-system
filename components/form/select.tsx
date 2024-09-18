import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as z from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { newStaffSchema } from "@/lib/class";

function FormSelect({
  name,
  form,
  placeholder,
  label,
  type,
  data,
}: {
  name: string;
  form: UseFormReturn<z.infer<typeof newStaffSchema>>;
  placeholder: string;
  label: string;
  type: string;
  data: { label: string; value: string }[];
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
            <FormControl>
                <SelectTrigger  className="w-full p-6 text-lg">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
            </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{placeholder}</SelectLabel>
                    {data.map((e) => {
                      return (
                        <SelectItem key={e.label} value={e.value.toUpperCase()}>
                          {e.label}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default FormSelect;
