import { Button } from "@/components/ui/button";

import { ExternalLink, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { GoPlus } from "react-icons/go";
import { DialogClose } from "@radix-ui/react-dialog";

const AssignTask = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <GoPlus />
        Assign Task
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <AssignTaskForm />

        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssignTask;



const AssignTaskForm = () => {
  return (
    <div className="w-full max-w-xl mx-auto p-4 bg-card rounded-2xl shadow-form">
      <DialogHeader>
        <DialogTitle className=" text-black text-[1.375rem]">Assign New Task</DialogTitle>
      </DialogHeader>
      {/* External Platform Link */}
      <div className="mb-5 mt-[1.5rem]">
        <label className="block text-sm font-medium text-foreground mb-2">
          External Platform Link (Optional)
        </label>
        <div className="relative">
          <Input
            type="url"
            placeholder="https://jira.company/task/123"
            className="pr-10"
          />
          <ExternalLink className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Task Title */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-foreground mb-2">
          Task Title
        </label>
        <Input type="text" placeholder="Enter task title" />
      </div>

      {/* Description */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-foreground mb-2">
          Description
        </label>
        <Textarea placeholder="Task description" rows={4} />
      </div>

      {/* Assign to */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-foreground mb-2">
          Assign to
        </label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select team member" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="member1">Team Member 1</SelectItem>
            <SelectItem value="member2">Team Member 2</SelectItem>
            <SelectItem value="member3">Team Member 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Due Date & Priority Row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Due Date
          </label>
          <div className="relative">
            <Input type="text" placeholder="mm/dd/yy" className=" w-full" />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Priority
          </label>
          <Select defaultValue="medium">
            <SelectTrigger className=" w-full">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-[1.5rem]">

        <DialogFooter>
          <DialogClose>
            <Button variant="secondary" className="px-8">
              Cancel
            </Button>
          </DialogClose>

          <Button>Create Task</Button>
        </DialogFooter>
      </div>
    </div>
  );
};
