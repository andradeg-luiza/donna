-- CreateTable
CREATE TABLE "TaskItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "taskId" TEXT NOT NULL,

    CONSTRAINT "TaskItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaskItem" ADD CONSTRAINT "TaskItem_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
