import { Resource } from '@model';

let testResourceList: Resource[] = Array(30).fill(0).map((_, index) => {
  return {
    projectId: 'project_xyz',
    resourceId: `resource_${index+1}`,
    name: `image_${index+1}.png`
  };
});

/* Upload resource and return ID of new created resource */
export const uploadResource = async (
  resourcePath: string,
  resourceName: string
): Promise<string> => {
  // TODO: integrate
  await new Promise(res => {
    setTimeout(res, 1000);
  });

  const newResource: Resource = {
    projectId: 'project_xyz',
    resourceId: `resource_${resourceName}`,
    name: `Name: ${resourceName}, path: ${resourcePath}`
  };

  testResourceList = [...testResourceList, newResource];
  return newResource.resourceId;
};

/* Fetch resource list for the current user and project */
export const fetchResourceList = async (): Promise<Resource[]> => {
  await new Promise(res => {
    setTimeout(res, 1000);
  });
  // TODO: integrate
  return testResourceList;
};
