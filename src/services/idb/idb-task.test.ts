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

  it('should edit a task in the database', async () => {
    const taskTitle = 'Task to Edit';
    const addedTask = await idbTask.add(taskTitle);

    const updatedTitle = 'Updated Task Title';
    await idbTask.edit(addedTask.id, { title: updatedTitle });

    const tasks = await idbTask.list();
    const updatedTask = tasks.find((task) => task.id === addedTask.id);

    expect(updatedTask).toBeDefined();
    expect(updatedTask?.title).toBe(updatedTitle);
  });

  it('should toggle task completion status', async () => {
    const taskTitle = 'Task to Toggle';
    const addedTask = await idbTask.add(taskTitle);

    await idbTask.edit(addedTask.id, { completed: true });

    const tasks = await idbTask.list();
    const toggledTask = tasks.find((task) => task.id === addedTask.id);

    expect(toggledTask).toBeDefined();
    expect(toggledTask?.completed).toBe(true);
  });

  it('should handle errors when editing a non-existent task', async () => {
    const nonExistentId = 'non-existent-id';
    await expect(idbTask.edit(nonExistentId, { title: 'New Title' })).resolves.not.toThrow();
  });

  it('should handle errors when adding a task to an uninitialized database', async () => {
    const uninitializedIdbTask = new IdbTask();
    await expect(uninitializedIdbTask.add('New Task')).rejects.toThrow('Please initialize idb');
  });

  it('should handle errors when editing a task in an uninitialized database', async () => {
    const uninitializedIdbTask = new IdbTask();
    await expect(uninitializedIdbTask.edit('some-id', { title: 'New Title' })).rejects.toThrow(
      'Please initialize idb',
    );
  });
});
