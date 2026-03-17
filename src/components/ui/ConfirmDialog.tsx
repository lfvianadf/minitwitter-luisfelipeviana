import { Modal } from './Modal'
import { Spinner } from './Spinner'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  isLoading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-sm">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        {description}
      </p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-ghost" disabled={isLoading}>
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="btn-danger flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading && <Spinner size="sm" className="text-white" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
