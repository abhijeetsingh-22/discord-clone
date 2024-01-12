"use client"
import axios from "axios"
import * as z from "zod"

import {
	Dialog,
	DialogHeader,
	DialogTitle,
	DialogContent,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog"

import {useModal} from "@/hooks/use-modal-store"

import {Button} from "@/components/ui/button"

import {useState} from "react"
import qs from "query-string"

const formSchema = z.object({
	name: z.string().min(1, {message: "Server Name is required"}),
	image: z.string().min(1, {message: "Server image is required"}),
})
export const DeleteMessageModal = () => {
	const {isOpen, onClose, type, data,onOpen} = useModal()
	const {apiUrl,query} = data

	const isModalOpen = isOpen && type == "deleteMessage"
	const [isLoading, setIsLoading] = useState(false)

	const onDelete=async()=>{
		try {
			setIsLoading(true)
			const url= qs.stringifyUrl({
				url:apiUrl || "",
				query:query
			})
			await axios.delete(url)
			onClose()

		} catch (error) {
			console.log(error)
		}finally{
			setIsLoading(false)
		}
	}
	return (
		<div>
			<Dialog
				open={isModalOpen}
				onOpenChange={onClose}
			>
				<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className=" pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold ">Delete Message</DialogTitle>
					</DialogHeader>
					<DialogDescription className="text-center text-zinc-500">
						Are you sure you want to do this? <br/>
						The message will be permanently deleted
					</DialogDescription>
					<DialogFooter className="flex items-center bg-gray-100 px-6 py-4">
						<div className="flex justify-between w-full">
							<Button 
								variant="ghost" 
								disabled={isLoading}
								onClick={()=>{onClose()}}
								>
								Cancel
							</Button>
							<Button 
								variant="primary"
								disabled={isLoading}
								onClick={()=>{onDelete()}}
								>
								Confirm
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
