import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl="http://localhost:8000/";
private token:any
  constructor(private http:HttpClient) {}

  login(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}auth/login`,data)
  }

  register(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}auth/register`,data)
  }
  // ظظظظظظظظظظظظظظظظظظظ

   getChatsByCharacter(characterId: string): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('TOKEN:', token);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}chat/character/${characterId}`, { headers }).pipe(
      map((res: any) => {
    return res.data;
  })
    );
  }


getMessagesByChatId(chatId: string): Observable<any[]> {

   const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

  return this.http.get(`${this.apiUrl}chat/get_messages/${chatId}`, {headers}).pipe(map((res: any) => res.data));
}

  deleteChat(chatId: string): Observable<any> {
     const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}chat/delete_chat/${chatId}`,{headers});
  }
// ///////
  deleteMessage(messageId: string): Observable<any> {
     const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}chat/delete_message/${messageId}`,{headers});
  }

  getCharacters(): Observable<any> {
     const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}chat/get_all_characters`,{headers});
  }

  // getCharacterById(characterId: string): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/get_character/${characterId}`);
  // }

  sendMessage(message: string, characterId: string, chatId: string | null): Observable<any> {
     const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}chat/send_message`, {
      message,
      character_id: characterId,
      chat_id: chatId
    },{headers});
  }
// auth.service.ts
getProfiles(): Observable<any> {
   const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  return this.http.get(`${this.apiUrl}auth/profiles`,{headers});
}

  updateProfile(profileData: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
    //  'Content-Type': 'application/json',
    //   'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}auth/profiles`, profileData, { headers });
  }


}
