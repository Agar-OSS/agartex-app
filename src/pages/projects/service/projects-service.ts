import { Project } from '@model';

let testProjectList: Project[] = Array(30).fill(0).map((_, index) => {
  return {
    projectId: `project_${index+1}`,
    name: `Project ${index+1}`,
    created: Date.now() - 24*60*60*1000,
    modified: Date.now() - (index+1)*60*1000,
    owner: 'rybahubert'
  };
})

/* Create project page of the given name and return ID of new created resource */
export const createProject = async (projectName: string): Promise<string> => {
  // TODO: replace with 
  // axios.post(AGARTEX_SERVICE_PROJECTS_URL, { projectName })
  await new Promise(res => {
    setTimeout(res, 1000);
  });

  const newProject: Project = {
    projectId: `id_${projectName.toLowerCase()}`,
    name: projectName,
    created: Date.now(),
    modified: Date.now(),
    owner: 'current user'
  };

  testProjectList = [newProject, ...testProjectList];
  return newProject.projectId;
};

/* Fetch projects list for the current user */
export const fetchProjectList = async (): Promise<Project[]> => {
  await new Promise(res => {
    setTimeout(res, 1000);
  });
  // TODO: replace with
  // axios.get(AGARTEX_SERIVCE_PROJECTS_URL, {});
  return testProjectList;
};
