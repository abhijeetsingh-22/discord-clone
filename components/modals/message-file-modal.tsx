'use client'
import { useEffect, useState } from 'react'
import axios from "axios"
import {useForm} from 'react-hook-form'
import * as z from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import qs from "query-string"

import {
	Dialog,
	DialogHeader,
	DialogTitle,
	DialogContent,
	DialogFooter,
	DialogDescription,
} from '@/components/ui/dialog'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import { FileUpload } from '@/components/file-upload'
import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'

const formSchema = z.object({
	fileUrl: z.string().min(1, {message: 'Attachment is required'}),
})
export const MessageFileModal = () => {
	const {isOpen,data,type,onClose} = useModal()
	const {apiUrl,query} =data
	const router= useRouter()
	const isModalOpen= isOpen && type==="messageFile"
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fileUrl: '',
		},
	})
	const isLoading = form.formState.isSubmitting

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			console.log(values)
			const url= qs.stringifyUrl({
				url:apiUrl ||"",
				query
			})
			await axios.post(url,{
				...values,
				content: values.fileUrl
			})

			form.reset()
			router.refresh()
			handleClose()
		} catch (error) {
			console.log(error)
		}
	}

	const handleClose=()=>{
		form.reset()
		onClose()
	}

	return (
		<div>
			<Dialog open={isModalOpen} onOpenChange={handleClose}>
				<DialogContent className='bg-white text-black p-0 overflow-hidden'>
					<DialogHeader className='pt-8 px-6'>
						<DialogTitle className='text-2xl text-center font-bold '>Add an attachment</DialogTitle>
						<DialogDescription className='text-center text-zinc-500 '>
							Send a file as a message
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
							<div className=' space-y-8 px-6'>
								<div className='flex items-center justify-center text-center'>
									<FormField
										control={form.control}
										name="fileUrl"
										render={({field})=>(
											<FormItem>
												<FormControl>
													<FileUpload
														endpoint="messageFile"
														value={field.value}
														onChange={field.onChange}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
								
							</div>
							<DialogFooter className='bg-gray-100 px-6 py-4'>
								<Button disabled={isLoading} variant='primary'>Send</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	)
}
