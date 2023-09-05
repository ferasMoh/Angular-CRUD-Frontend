import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/user/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  messageConfirm: string = '';
  dialogConfirm: string = 'no';

  constructor(private http: HttpClient) { }

  /*   Get User Tasks */
  getUserTasks(userId: string, tasksParams: any) {
    let params = new HttpParams();
    Object.entries(tasksParams).forEach(([key, value]: any) => {
      params = params.append(key, value)
    })
    return this.http.get(environment.baseApi + '/user-tasks/' + userId, { params })
  }

  /*   Complete Task */
  completeTask(model: object) {
    return this.http.put(environment.baseApi + '/complete', model)
  }

  /*   Get Task Details */
  taskDetails(id: any) {
    return this.http.get(environment.baseApi + '/task/' + id)
  }

}
