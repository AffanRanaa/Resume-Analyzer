export default function ConfirmDeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 z-10">
        <div className="text-center mb-5">
          <div className="text-4xl mb-3">🗑️</div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Delete this analysis?</h2>
          <p className="text-sm text-slate-500">
            This will permanently remove the resume file and its analysis. This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}