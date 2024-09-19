import { useMemo } from 'react';
import { LuDownload } from 'react-icons/lu';
import ModalPortal from '@components/modal/ModalPortal';
import ModalLayout from '@layouts/ModalLayout';
import Spinner from '@components/common/Spinner';
import RoleIcon from '@components/common/RoleIcon';
import CustomMarkdown from '@components/common/CustomMarkdown';
import { useReadAssignees, useReadTaskFiles } from '@hooks/query/useTaskQuery';
import { useReadStatuses } from '@hooks/query/useStatusQuery';

import type { Task } from '@/types/TaskType';
import type { Project } from '@/types/ProjectType';

type ViewModalTaskProps = {
  project: Project;
  task: Task;
  onClose: () => void;
};

export default function DetailModalTask({ project, task, onClose: handleClose }: ViewModalTaskProps) {
  // ToDo: 다운로드 파일 목록 가져오기
  const { status, isStatusLoading } = useReadStatuses(project.projectId, task.statusId);
  const { assigneeList, isAssigneeLoading } = useReadAssignees(project.projectId, task.taskId);
  const { taskFileList, isTaskFileLoading } = useReadTaskFiles(project.projectId, task.taskId);

  const { name, startDate, endDate } = task;
  const period = useMemo(
    () => (endDate && startDate !== endDate ? `${startDate} - ${endDate}` : startDate),
    [startDate, endDate],
  );

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
            <button type="submit" className="h-25 w-full rounded-md bg-main px-10 text-white">
              수정
            </button>
          </article>
        )}
      </ModalLayout>
    </ModalPortal>
  );
}
