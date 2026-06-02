import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  get_pending_tasks,
  get_integration_assignees,
  review_task,
  bulk_approve_tasks,
  type ExtractedTask,
} from "@/config/services/integrations.service";
import PageHeader from "@/shared/components/page-header.component";
import { toast } from "sonner";
import { VscLoading } from "react-icons/vsc";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoCreateOutline,
  IoCheckmarkDone,
} from "react-icons/io5";
import { FiUser, FiCalendar, FiFlag } from "react-icons/fi";

function AITaskReviewPage() {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingTask, setEditingTask] = useState<ExtractedTask | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priority: "medium" as "high" | "medium" | "low",
    due_date: "",
    assignee_id: "",
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ["pending-tasks"],
    queryFn: () => get_pending_tasks({ limit: "50" }),
  });

  const { data: assigneesResponse } = useQuery({
    queryKey: ["integration-assignees"],
    queryFn: get_integration_assignees,
  });

  const tasks = response?.data || [];
  const assignees = assigneesResponse?.data || [];

  const reviewMutation = useMutation({
    mutationFn: ({
      id,
      action,
    }: {
      id: string;
      action: "approved" | "rejected";
    }) => review_task(id, { review_status: action }),
    onSuccess: (_, vars) => {
      toast.success(`Task ${vars.action}`);
      queryClient.invalidateQueries({ queryKey: ["pending-tasks"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const editMutation = useMutation({
    mutationFn: () =>
      review_task(editingTask!.id, {
        review_status: "approved",
        title: editForm.title,
        description: editForm.description,
        priority: editForm.priority,
        ...(editForm.due_date ? { due_date: editForm.due_date } : {}),
        ...(editForm.assignee_id ? { assignee_id: editForm.assignee_id } : {}),
      }),
    onSuccess: () => {
      toast.success("Task edited and approved");
      queryClient.invalidateQueries({ queryKey: ["pending-tasks"] });
      setEditingTask(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const bulkMutation = useMutation({
    mutationFn: () => bulk_approve_tasks(selectedIds),
    onSuccess: (res) => {
      toast.success(`${res.data.approved_count} task(s) approved`);
      queryClient.invalidateQueries({ queryKey: ["pending-tasks"] });
      setSelectedIds([]);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    if (selectedIds.length === tasks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tasks.map((t: ExtractedTask) => t.id));
    }
  };

  const openEdit = (task: ExtractedTask) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      due_date: task.due_date ? task.due_date.slice(0, 10) : "",
      assignee_id: task.assignee_id || "",
    });
  };

  const priorityColors = {
    high: "bg-red-50 text-red-700",
    medium: "bg-amber-50 text-amber-700",
    low: "bg-green-50 text-green-700",
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="AI Task Review"
        subtitle="Review and approve tasks extracted from meeting transcripts"
      />

      {/* Bulk Actions */}
      {tasks.length > 0 && (
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={
                selectedIds.length === tasks.length && tasks.length > 0
              }
              onChange={selectAll}
              className="w-4 h-4 rounded border-gray-300 text-primary-color focus:ring-primary-color"
            />
            <span className="text-sm text-gray-600">
              Select All ({tasks.length})
            </span>
          </label>

          {selectedIds.length > 0 && (
            <button
              onClick={() => bulkMutation.mutate()}
              disabled={bulkMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {bulkMutation.isPending ? (
                <VscLoading className="animate-spin" />
              ) : (
                <IoCheckmarkDone />
              )}
              Approve Selected ({selectedIds.length})
            </button>
          )}
        </div>
      )}

      {/* Tasks List */}
      <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <VscLoading className="animate-spin text-2xl text-gray-400" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20">
            <IoCheckmarkDone className="mx-auto text-4xl text-green-400 mb-3" />
            <p className="text-gray-500 text-sm">
              All caught up! No pending tasks to review.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tasks.map((task: ExtractedTask) => (
              <div
                key={task.id}
                className="px-6 py-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(task.id)}
                    onChange={() => toggleSelect(task.id)}
                    className="w-4 h-4 rounded border-gray-300 text-primary-color focus:ring-primary-color mt-1"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {task.title}
                      </h4>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      {task.suggested_assignee_name && (
                        <span className="flex items-center gap-1">
                          <FiUser size={11} />
                          {task.suggested_assignee_name}
                          {task.assignee && (
                            <span className="text-green-500 ml-1">
                              (mapped)
                            </span>
                          )}
                        </span>
                      )}
                      {task.transcript && (
                        <span className="truncate max-w-[200px]">
                          From: {task.transcript.title}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEdit(task)}
                      className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                      title="Edit & Approve"
                    >
                      <IoCreateOutline size={16} />
                    </button>
                    <button
                      onClick={() =>
                        reviewMutation.mutate({
                          id: task.id,
                          action: "approved",
                        })
                      }
                      disabled={reviewMutation.isPending}
                      className="p-2 rounded-lg text-green-500 hover:bg-green-50 transition-colors"
                      title="Approve"
                    >
                      <IoCheckmarkCircle size={18} />
                    </button>
                    <button
                      onClick={() =>
                        reviewMutation.mutate({
                          id: task.id,
                          action: "rejected",
                        })
                      }
                      disabled={reviewMutation.isPending}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                      title="Reject"
                    >
                      <IoCloseCircle size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl mx-4">
            <h3 className="font-semibold text-gray-900 mb-4">
              Edit & Approve Task
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-color"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-color resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiFlag className="inline mr-1" size={12} />
                    Priority
                  </label>
                  <select
                    value={editForm.priority}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        priority: e.target.value as "high" | "medium" | "low",
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-color"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiCalendar className="inline mr-1" size={12} />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editForm.due_date}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        due_date: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-color"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiUser className="inline mr-1" size={12} />
                  Assignee
                </label>
                <select
                  value={editForm.assignee_id}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      assignee_id: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-color"
                >
                  <option value="">Unassigned</option>
                  {assignees.map((assignee) => (
                    <option key={assignee.id} value={assignee.id}>
                      {assignee.first_name} {assignee.last_name} -{" "}
                      {assignee.email}
                    </option>
                  ))}
                </select>
              </div>

              {editingTask.suggested_assignee_name && (
                <div className="text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">
                  Suggested Assignee:{" "}
                  <strong>{editingTask.suggested_assignee_name}</strong>
                  {editingTask.suggested_assignee_email &&
                    ` (${editingTask.suggested_assignee_email})`}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => editMutation.mutate()}
                disabled={editMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {editMutation.isPending && (
                  <VscLoading className="animate-spin" />
                )}
                Save & Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AITaskReviewPage;
