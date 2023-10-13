"use client"
import axios from "axios"
import * as z from "zod"

import {
	Dialog,
	DialogHeader,
	DialogTitle,
	DialogContent,
	DialogDescription,
} from "@/components/ui/dialog"

import {useRouter} from "next/navigation"
import {useModal} from "@/hooks/use-modal-store"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Check, Copy, RefreshCw} from "lucide-react"
import {useOrigin} from "@/hooks/use-origin"
import {useState} from "react"

const formSchema = z.object({
	name: z.string().min(1, {message: "Server Name is required"}),
	image: z.string().min(1, {message: "Server image is required"}),
})
export const InviteModal = () => {
	const {isOpen, onClose, type, data,onOpen} = useModal()
	const {server} = data

	const origin = useOrigin()
	const isModalOpen = isOpen && type == "invite"
	const [copied, setCopied] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const inviteUrl = `${origin}/invite/${server?.inviteCode}`

	const onCopy = () => {
		navigator.clipboard.writeText(inviteUrl)
		setCopied(true)

		setTimeout(() => {
			setCopied(false)
		}, 1000)
	}
	const onNew = async () => {
		try {
			setIsLoading(true)
			const response=await axios.patch(`/api/servers/${server?.id}/invite-code`)
			onOpen("invite",{server:response.data})
		} catch (error) {
			
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
					<DialogTitle className="text-2xl text-center font-bold ">Invite Friends</DialogTitle>
					<div className="p-6">
						<Label className=" uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
							Server invite Link
						</Label>
						<div className="flex items-center mt-2 gap-x-2">
							<Input
								disabled={isLoading}
								className=" bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
								value={inviteUrl}
							/>
							<Button
								size="icon"
								onClick={onCopy}
								disabled={isLoading}
							>
								{copied ? <Check className=" w-4 h-4" /> : <Copy className=" w-4 h-4" />}
							</Button>
						</div>
						<Button
							disabled={isLoading}
							onClick={onNew}
							variant="link"
							className=" text-xs text-zinc-500 mt-4"
						>
							Generate a new link
							<RefreshCw className=" w-4 h-4 ml-2" />
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
