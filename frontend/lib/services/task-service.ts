import { Task, TaskSubmission, TaskApplication } from "@/lib/types";
import { MOCK_TASKS, MOCK_TASK_APPLICATIONS } from "@/lib/mock/tasks";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface SubmitPRParams {
  taskId: string;
  contributorId: string;
  prUrl: string;
  prNumber: number;
  headSha: string;
}

export const taskService = {
  async listTasks(filters?: {
    status?: string;
    chain?: string;
    minReward?: number;
    maxReward?: number;
    search?: string;
  }): Promise<Task[]> {
    await delay(300);
    
    let tasks = [...MOCK_TASKS];
    
    if (filters?.status && filters.status !== "all") {
      tasks = tasks.filter((t) => t.status === filters.status);
    }
    
    if (filters?.chain && filters.chain !== "all") {
      tasks = tasks.filter((t) => t.chain.id === filters.chain);
    }
    
    if (filters?.minReward !== undefined && filters.minReward !== null) {
      tasks = tasks.filter((t) => t.rewardAmount >= filters.minReward!);
    }
    
    if (filters?.maxReward !== undefined && filters.maxReward !== null) {
      tasks = tasks.filter((t) => t.rewardAmount <= filters.maxReward!);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search) ||
          t.projectName.toLowerCase().includes(search)
      );
    }
    
    return tasks;
  },

  async getTask(id: string): Promise<Task | null> {
    await delay(200);
    return MOCK_TASKS.find((t) => t.id === id) || null;
  },

  async applyToTask(taskId: string, contributorId: string): Promise<TaskApplication> {
    await delay(500);
    
    const task = MOCK_TASKS.find((t) => t.id === taskId);
    if (!task) throw new Error("Task not found");
    
    if (task.applicants.length >= task.maxContributors) {
      throw new Error(`Maximum ${task.maxContributors} contributors already applied`);
    }
    
    if (task.applicants.includes(contributorId)) {
      throw new Error("Already applied to this task");
    }
    
    const application: TaskApplication = {
      id: `app${Date.now()}`,
      taskId,
      contributorId,
      contributorName: "Current User",
      contributorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
      appliedAt: new Date().toISOString(),
      status: "applied",
    };
    
    return application;
  },

  async submitPR(params: SubmitPRParams): Promise<TaskSubmission> {
    await delay(800);
    
    const submission: TaskSubmission = {
      id: `sub${Date.now()}`,
      taskId: params.taskId,
      contributorId: params.contributorId,
      contributorName: "Current User",
      contributorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
      prUrl: params.prUrl,
      prNumber: params.prNumber,
      headSha: params.headSha,
      submittedAt: new Date().toISOString(),
    };
    
    return submission;
  },

  async getTaskApplications(taskId: string): Promise<TaskApplication[]> {
    await delay(200);
    return MOCK_TASK_APPLICATIONS.filter((app) => app.taskId === taskId);
  },

  async getMyApplications(contributorId: string): Promise<Array<{ task: Task; application: TaskApplication }>> {
    await delay(300);
    
    const myApps = MOCK_TASK_APPLICATIONS.filter((app) => app.contributorId === contributorId);
    
    const result = await Promise.all(
      myApps.map(async (app) => {
        const task = await this.getTask(app.taskId);
        return { task: task!, application: app };
      })
    );
    
    return result.filter((r) => r.task);
  },

  async withdrawApplication(applicationId: string): Promise<void> {
    await delay(400);
    // Mock withdraw
  },
};
