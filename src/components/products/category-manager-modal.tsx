"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField, formControlClass } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import {
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
	useUpdateCategoryMutation,
	useCategoriesQuery,
} from "@/hooks/use-categories-query";
import { z } from "zod";

const categoryFormSchema = z.object({
	name: z.string().trim().min(2, "Informe o nome da categoria"),
	parentId: z.string(),
});
type CategoryFormFields = z.infer<typeof categoryFormSchema>;

type CategoryManagerModalProps = {
	triggerLabel?: string;
};

export function CategoryManagerModal({
	triggerLabel = "Categorias",
}: CategoryManagerModalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const { data: categories = [] } = useCategoriesQuery();
	const createCategory = useCreateCategoryMutation();
	const updateCategory = useUpdateCategoryMutation();
	const deleteCategory = useDeleteCategoryMutation();
	const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormFields>({
		resolver: zodResolver(categoryFormSchema),
		defaultValues: { name: "", parentId: "" },
	});

	function close() {
		setIsOpen(false);
		setEditingId(null);
		reset({ name: "", parentId: "" });
	}

	function edit(id: string) {
		const category = categories.find((item) => item.id === id);
		if (!category) return;
		setEditingId(id);
		reset({ name: category.name, parentId: category.parentId ?? "" });
	}

	async function submit(fields: CategoryFormFields) {
		try {
			const input = { name: fields.name, parentId: fields.parentId || null };
			if (editingId) await updateCategory.mutateAsync({ id: editingId, input });
			else await createCategory.mutateAsync(input);
			reset({ name: "", parentId: "" });
			setEditingId(null);
			toast.success("Categoria salva com sucesso.");
		} catch (error) {
			console.error(error);
			toast.error("Não foi possível salvar a categoria.");
		}
	}

	async function remove(id: string) {
		try {
			await deleteCategory.mutateAsync(id);
			toast.success("Categoria removida com sucesso.");
		} catch (error) {
			console.error(error);
			toast.error("Não foi possível remover a categoria.");
		}
	}

	return (
		<>
			<Button variant="outline" onClick={() => setIsOpen(true)}>{triggerLabel}</Button>
			{isOpen ? (
				<Modal title="Gerenciar categorias" description="Crie, edite ou remova as categorias dos produtos." closeLabel="Fechar categorias" onClose={close} size="lg" layout="scrollable">
					<form onSubmit={handleSubmit(submit)} className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto]" noValidate>
						<FormField label="Nome" inputId="category-name" error={errors.name?.message}>
							<input {...register("name")} id="category-name" className={formControlClass({ hasError: Boolean(errors.name) })} />
						</FormField>
						<FormField label="Categoria pai" inputId="category-parent">
							<select {...register("parentId")} id="category-parent" className={formControlClass({ hasError: false })}>
								<option value="">Nenhuma</option>
								{categories.filter((item) => item.id !== editingId).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
							</select>
						</FormField>
						<Button type="submit" className="self-end" disabled={createCategory.isPending || updateCategory.isPending}>
							{editingId ? <Pencil className="size-4" /> : <Plus className="size-4" />} {editingId ? "Salvar" : "Criar"}
						</Button>
					</form>
					<div className="mt-6 divide-y divide-border rounded-[var(--radius-card)] border border-border">
						{categories.map((category) => (
							<div key={category.id} className="flex items-center gap-3 p-3">
								<p className="min-w-0 flex-1 truncate font-medium">{category.name}</p>
								<Button size="compact" variant="outline" onClick={() => edit(category.id)}><Pencil className="size-4" />Editar</Button>
								<Button size="compact" variant="outline" onClick={() => remove(category.id)} disabled={deleteCategory.isPending}><Trash2 className="size-4" />Remover</Button>
							</div>
						))}
					</div>
				</Modal>
			) : null}
		</>
	);
}
