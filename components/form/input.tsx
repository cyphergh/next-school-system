
import React from 'react'
import * as z from  'zod'
import {useForm, UseFormReturn} from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { newStaffSchema } from '@/lib/class'
function FormInput({name,form,placeholder,label,type}:{name:string,form:UseFormReturn<z.infer<typeof newStaffSchema>>,placeholder:string,label:string,type:string}) {
  return (
    <FormField
     name={name}
     render={({field})=>{
        return <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
        <Input placeholder={placeholder} autoComplete='off' type={type} {...field} className='p-[1.5rem] text-lg'></Input>
        </FormControl>
        <FormMessage />
        </FormItem>
     }}
    >

    </FormField>
  )
}

export default FormInput