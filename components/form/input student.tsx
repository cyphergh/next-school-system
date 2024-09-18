
import React from 'react'
import * as z from  'zod'
import {useForm, UseFormReturn} from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { newStaffSchema, newStudentSchema } from '@/lib/class'
function StudentFormInput({name,form,placeholder,label,type}:{name:string,form:UseFormReturn<z.infer<typeof newStudentSchema>>,placeholder:string,label:string,type:string}) {
  return (
    <FormField
     name={name}
     render={({field})=>{
        return <FormItem>
        <FormLabel className='capitalize'>{label}</FormLabel>
        <FormControl>
        <Input  placeholder={placeholder} autoComplete='off' type={type} {...field} className='p-[1.5rem]  capitalize'></Input>
        </FormControl>
        <FormMessage />
        </FormItem>
     }}
    >

    </FormField>
  )
}

export default StudentFormInput