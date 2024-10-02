import { useMemo } from 'react';
import { LuDownload } from 'react-icons/lu';
import ModalPortal from '@components/modal/ModalPortal';
import ModalLayout from '@layouts/ModalLayout';
import ModalButton from '@components/modal/ModalButton';
import Spinner from '@components/common/Spinner';
import RoleIcon from '@components/common/RoleIcon';
import CustomMarkdown from '@components/common/CustomMarkdown';
import { useReadStatuses } from '@hooks/query/useStatusQuery';
import { useDeleteTask, useReadAssignees, useReadTaskFiles } from '@hooks/query/useTaskQuery';

import type { Task } from '@/types/TaskType';
import type { Project } from '@/types/ProjectType';

type ViewModalTaskProps = {
  project: Project;
  task: Task;
  onClose: () => void;
};

export default function DetailModalTask({ project, task, onClose: handleClose }: ViewModalTaskProps) {
  const { mutate: deleteTaskMutate } = useDeleteTask(project.projectId);
  const { status, isStatusLoading } = useReadStatuses(project.projectId, task.statusId);
  const { assigneeList, isAssigneeLoading } = useReadAssignees(project.projectId, task.taskId);
  const { taskFileList, isTaskFileLoading } = useReadTaskFiles(project.projectId, task.taskId);

  const { name, startDate, endDate } = task;
  const period = useMemo(
    () => (endDate && startDate !== endDate ? `${startDate} - ${endDate}` : startDate),
    [startDate, endDate],
  );

  // ToDo: 일정 수정 버튼 클릭시 처리 추가할 것
  const handleUpdateClick = () => {};

  // ToDo: 유저 권한 확인하는 로직 추가할 것
  const handleDeleteClick = (taskId: Task['taskId']) => deleteTaskMutate(taskId);

  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        {isStatusLoading || isAssigneeLoading || isTaskFileLoading ? (
          <Spinner />
        ) : (
          <article className="flex h-full flex-col justify-center gap-20">
            <section className="space-y-5">
              <div className="mb-10 flex items-center justify-start">
                <div className="flex items-center rounded-lg border border-input bg-white px-5 py-3">
                  <div style={{ borderColor: status?.colorCode }} className="mr-3 size-8 rounded-full border" />
                  <p className="text-xs">{status?.statusName}</p>
                </div>
              </div>
              <div className="flex gap-10">
                <h2 className="w-50 shrink-0 text-large font-bold">일정명</h2>
                <span>{name}</span>
              </div>
              <div className="flex gap-10">
                <h2 className="w-50 shrink-0 text-large font-bold">기간</h2>
                <span>{period}</span>
              </div>
              <div className="flex gap-10">
                <h2 className="w-50 shrink-0 text-large font-bold">수행자</h2>
                <ul className="flex flex-wrap gap-5">
                  {assigneeList?.map(({ userId, nickname, roleName }) => (
                    <li key={userId} className="flex items-center space-x-4 rounded-md bg-button px-5">
                      <RoleIcon roleName={roleName} />
                      <div>{nickname}</div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="my-5 text-large font-bold">일정 내용</h2>
                <CustomMarkdown markdown={task.content} />
              </div>
              {taskFileList.length > 0 && (
                <div>
                  <h2 className="my-5 text-large font-bold">파일 다운로드</h2>
                  <ul className="flex flex-wrap gap-5">
                    {taskFileList.map((taskFile) => (
                      <li
                        key={taskFile.fileId}
                        className="flex cursor-pointer items-center gap-5 rounded-md bg-button px-4 py-2 hover:bg-sub"
                        aria-label="file download"
                      >
                        <a href={taskFile.fileUrl} download>
                          {taskFile.fileName}
                        </a>
                        <LuDownload />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
            <div className="flex min-h-25 gap-10">
              <ModalButton backgroundColor="bg-main" onClick={handleUpdateClick}>
                수정
              </ModalButton>
              <ModalButton backgroundColor="bg-delete" onClick={() => handleDeleteClick(task.taskId)}>
                삭제
              </ModalButton>
            </div>
          </article>
        )}
      </ModalLayout>
    </ModalPortal>
  );
}
