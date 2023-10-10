'use client'
import {
	Dialog,
	DialogHeader,
	DialogTitle,
	DialogContent,
	DialogFooter,
	DialogDescription,
} from '@/components/ui/dialog'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Input} from '../ui/input'
import {Button} from '../ui/button'
import {useForm} from 'react-hook-form'
import * as z from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'

const formSchema = z.object({
	name: z.string().min(1, {message: 'Server Name is required'}),
	image: z.string().min(1, {message: 'Server image is required'}),
})
export const InitialModal = () => {
	const [isMounted,setIsMounted]=useState(false)
	useEffect(()=>{
		setIsMounted(true)
	},[])
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			image: '',
		},
	})
	const isLoading = form.formState.isSubmitting

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values)
	}

	if(!isMounted)
		return null

	return (
		<div>
			<Dialog open>
				<DialogContent className='bg-white text-black p-0 overflow-hidden'>
					<DialogHeader className='pt-8 px-6'>
						<DialogTitle className='text-2xl text-center font-bold '>Create a srever</DialogTitle>
						<DialogDescription className='text-center text-zinc-500 '>
							Give your server a personality with a name and a image. You can always change it
							later.
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
							<div className=' space-y-8 px-6'>
								<div className='flex items-center justify-center text-center'>
									{' '}
									TODO: Image Upload
								</div>
								<FormField
									control={form.control}
									name='name'
									render={({field}) => (
										<FormItem>
											<FormLabel className=' uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
												Server Name
											</FormLabel>
											<FormControl>
												<Input
													disabled={isLoading}
													className='bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
													placeholder='Enter Server Name'
													{...field}
												/>
											</FormControl>
											<FormMessage/>
										</FormItem>
									)}
								/>
							</div>
							<DialogFooter className='bg-gray-100 px-6 py-4'>
								<Button disabled={isLoading} variant='primary'>Create</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	)
}
