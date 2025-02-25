import 'fake-indexeddb/auto';
import { IdbTask } from './idb-task';

describe('IdbTask Integration Tests', () => {
  let idbTask: IdbTask;

  beforeAll(async () => {
    idbTask = await IdbTask.getInstance();
    await idbTask.init();
  });

  afterAll(async () => {
    if (idbTask) {
      await idbTask.init();
    }
  });

  it('should add a task to the database', async () => {
    const taskTitle = 'Test Task';
    const addedTask = await idbTask.add(taskTitle);

    expect(addedTask).toHaveProperty('id');
    expect(addedTask.title).toBe(taskTitle);
    expect(addedTask.completed).toBe(false);
  });

  it('should list all tasks from the database', async () => {
    const taskTitle1 = 'Task 1';
    const taskTitle2 = 'Task 2';

    await idbTask.add(taskTitle1);
    await idbTask.add(taskTitle2);

    const tasks = await idbTask.list();

    expect(tasks.length).toBeGreaterThanOrEqual(2);
    expect(tasks.some((task) => task.title === taskTitle1)).toBe(true);
    expect(tasks.some((task) => task.title === taskTitle2)).toBe(true);
  });

  it('should delete a task from the database', async () => {
    const taskTitle = 'Task to Delete';
    const addedTask = await idbTask.add(taskTitle);

    await idbTask.delete(addedTask.id);

    const tasks = await idbTask.list();
    expect(tasks.some((task) => task.id === addedTask.id)).toBe(false);
  });

  it('should handle errors when deleting a non-existent task', async () => {
    const nonExistentId = 'non-existent-id';
    await expect(idbTask.delete(nonExistentId)).resolves.not.toThrow();
  });

  it('should handle errors when listing tasks from an uninitialized database', async () => {
    const uninitializedIdbTask = new IdbTask();
    await expect(uninitializedIdbTask.list()).rejects.toThrow('Please initialize idb');
  });
});
