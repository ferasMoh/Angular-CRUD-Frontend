import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateTask } from '../Context/DTOs';
import { environment } from 'projects/admin/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TasksService {

  dialogConfirm: string = 'no';
  messageConfirm: string = '';

  constructor(private http: HttpClient) { }

  /*   Get All Tasks */
  getAllTasks(filter: any) {
    let params = new HttpParams()
    Object.entries(filter).forEach(([key, value]: any) => {
      if (value) {
        params = params.append(key, value)
      }
    })

    return this.http.get(environment.baseApi + '/all-tasks', { params });
  }

  /*   Create New Task */
  createTask(model: any) {
    return this.http.post(environment.baseApi + '/add-task', model)
  }

  /*   Edit Task */
  editTask(model: any, id: any) {
    return this.http.put(environment.baseApi + '/edit-task/' + id, model)
  }

  /*   Delete Task */
  deleteTask(id: any) {
    return this.http.delete(environment.baseApi + '/delete-task/' + id)
  }

}
