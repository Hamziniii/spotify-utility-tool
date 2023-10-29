export type BaseTag = {
  name: string;
  color: string;
};

export type Tag = BaseTag & {
  id: string;
};

// return a list of all tags
export function getTagList(): Tag[] {
  // check localstorage for tag list
  // if not found, return empty array
  // if found, return tag list

  const tagList = localStorage.getItem("tagList");

  if (tagList) {
    return JSON.parse(tagList);
  }

  return [];
}

// create a new tag given a name and color
export function createNewTag({ name, color }: BaseTag) {
  const tagList = getTagList();

  // check that tag already exists
  const tagExists = tagList.some((tag) => tag.name === name);
  if (tagExists) {
    throw new Error("Tag " + name + " already exists!");
  }

  const newTag = {
    id: Date.now().toString(),
    name,
    color,
  };

  tagList.push(newTag);

  localStorage.setItem("tagList", JSON.stringify(tagList));
}

// update a tag based on its id
export function updateTag({ id, name, color }: Tag) {
  const tagList = getTagList();
  const tagIndex = tagList.findIndex((tag) => tag.id === id);

  if (tagIndex == -1) {
    throw new Error("Tag " + id + " doesn't exist!");
  }

  tagList[tagIndex] = {
    id,
    name,
    color,
  };

  localStorage.setItem("tagList", JSON.stringify(tagList));
}

// get tag by id
export function getTagById(id: string): Tag | undefined {
  const tagList = getTagList();

  return tagList.find((tag) => tag.id === id);
}

// get tag by name
export function getTagByName(name: string): Tag | undefined {
  const tagList = getTagList();

  return tagList.find((tag) => tag.name === name);
}