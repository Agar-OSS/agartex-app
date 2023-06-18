import { AGARTEX_SERVICE_PROJECTS_URL } from '@constants';
import { Project } from '@model';
import axios from 'axios';

interface RawProject {
  project_id: string,
  project_name: string,

  owner_id: string,
  owner_email: string,

  created_at: string,
  last_modified: string
}

/* Create project page of the given name and return ID of new created resource */
export const createProject = async (projectName: string): Promise<string> => {
  const res = await axios.post<RawProject>(AGARTEX_SERVICE_PROJECTS_URL, { name: projectName });
  return res.data.project_id;
};

/* Fetch projects list for the current user */
export const fetchProjectList = async (): Promise<Project[]> => {
  const res = await axios.get<RawProject[]>(AGARTEX_SERVICE_PROJECTS_URL);
  return res.data.map((raw) => ({
    projectId: raw.project_id,
    name: raw.project_name,
    owner: raw.owner_email,
    created: raw.created_at,
    modified: raw.last_modified
  }));
};
