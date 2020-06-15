import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiCallerService } from '../api-caller.service';
import { Message } from '../models/message';
import {ToastaService, ToastaConfig, ToastOptions, ToastData} from 'ngx-toasta';

@Component({
  selector: 'app-home',
  providers: [ ApiCallerService ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('videoPlayer') videoplayer: ElementRef;
  isPlaying: boolean = true;
  videoSource: string = "../../assets/3. Series.mp4";;
  stripedVideoSource: string = "";
  callStack: Array<number> = new Array();
  endTimeStack: Array<number> = new Array();
  isReplay: boolean = false;
  
  transcript: Array<any> = new Array();
  fallbacks: Array<any> = new Array();

  transcriptClassified: Array<any> = new Array();
  isVideoSourceSelected:boolean = false;

  callbacks: Array<any> = new Array();
  keywords: Array<string> = new Array();
  noteTitle: string;
  files: File;

  public message : Message;
  public messages : Message[];

  toastOptions: ToastOptions;

  constructor(private _api: ApiCallerService, private toastaService:ToastaService, private toastaConfig: ToastaConfig) {
      this.message = new Message('', 'assets/images/user.png');
      this.messages = [
        new Message(`Hey! I'm Rhea`, 'assets/images/bot.png', new Date())
      ];
      this.toastaConfig.theme = 'material';
      this.toastOptions = {
        title: "",
        msg: "",
        showClose: true,
        timeout: 5000,
        theme: 'material',
        onAdd: (toast:ToastData) => {
            console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast:ToastData) {
            console.log('Toast ' + toast.id + ' has been removed!');
        }
      };
      // this.transcript.push({"topic":"Linear Regression", "start": 223, "end":442 });
      // this.transcript.push({"topic":"Logistic Regression", "start": 332, "end": 670});
   }

  ngOnInit() {
    console.log(this.transcript);

    this._api.doGetRequest('/srt').subscribe(res => {
      if(res.error == null) {
        this.transcript = res.data;
        console.log(this.transcript);
        this.formatTranscript();
        // console.log(this.transcriptClassified);
      } else {
        console.log(res.error);
      }
    });

    this._api.doGetRequest("/get_keywords/3. Series/20").subscribe(res => {
      this.keywords = res.data;
    });

    // setInterval(() => {
    //   if(this.isReplay && Math.trunc(this.videoplayer.nativeElement.currentTime) === this.endTimeStack[this.endTimeStack.length - 1]) {
    //     this.videoplayer.nativeElement.currentTime = this.callStack.pop();
    //     this.endTimeStack.pop();
    //     this.isReplay = false;
    //     console.log(this.callStack);
    //     console.log(this.endTimeStack);
    //   }
    //   if(this.endTimeStack.length > 0) {
    //     this.isReplay = true;
    //   }
    //   if(this.endTimeStack.length == 0) {
    //     this.isReplay = false;
    //   }
    // }, 1000);
  }

  formatTranscript() {
    var classified = {};
    try {
      for(var i = 0; i < this.transcript.length; i++) {
        if(classified["text"] == null) {
          classified["start"] = this.transcript[i].start;
          classified["topic"] = this.transcript[i].topic;
          classified["text"] = this.transcript[i].text;
        } 
        else if(this.transcript[i].topic == classified["topic"] && classified["text"] != null) {
          classified["text"] += this.transcript[i].text;
        } else if(this.transcript[i].topic != classified["topic"] && classified["text"] != null) {
          classified["end"] = this.transcript[i-1].end;
          this.transcriptClassified.push(classified);
          classified = {};
          classified["text"] = this.transcript[i].text;
          classified["start"] = this.transcript[i].start;
          classified["topic"] = this.transcript[i].topic;
        }
        if(i == this.transcript.length - 1) {
          classified["end"] = this.transcript[i].end;
          this.transcriptClassified.push(classified);
          classified = {};
        }
      }
    } catch(error) {
      
    } 
  }

  toggleVideo(event: any) {
    if(this.isPlaying) {
      this.videoplayer.nativeElement.pause();  
    } else {
      this.videoplayer.nativeElement.play();
    }
  }

  pluralizeString = (count, noun, suffix = 's') => `${noun}${count !== 1 ? suffix : ''}`; 

  seekToTopic(topic: string) {
    for(var i = 0; i < this.transcriptClassified.length; i++) {
      // Check exact match
      // Check pluralized string in transcript with returned topic
      // Check topic with pluralized string of returned topic
      topic = topic.replace("?", "")
      .replace("#","")
      .replace("'","")
      .replace(`"`, "")
      .replace(".","")
      .replace(",", "")
      .replace("!","");
      var flag = false;
      if(String(this.transcriptClassified[i].topic).toLowerCase() == topic.toLowerCase()) {
        this.seek(this.transcriptClassified[i].start, this.transcriptClassified[i].end);
        this.callbacks.push(this.transcriptClassified[i]);
        flag = true;
        break;
      } else if(this.pluralizeString(2, String(this.transcriptClassified[i].topic).toLowerCase()) == topic.toLowerCase()) {
        this.seek(this.transcriptClassified[i].start, this.transcriptClassified[i].end);
        this.callbacks.push(this.transcriptClassified[i]);
        flag = true;
        break;
      } else if(String(this.transcriptClassified[i].topic).toLowerCase() == this.pluralizeString(2,topic.toLowerCase())) {
        this.seek(this.transcriptClassified[i].start, this.transcriptClassified[i].end);
        this.callbacks.push(this.transcriptClassified[i]);
        flag = true;
        break;
      }
    }
    if(!flag) {
      this._api.doGetRequest("/get_saved_clips/"+topic).subscribe(res => {
        if(res.error == null) {
          this.fallbacks = res.data;
          let element: HTMLElement = document.getElementById('getFromArchive') as HTMLElement;
          element.click();
        }
      });
    }
    // for(var i = 0; i < this.transcript.length; i++) {
    //   // Check exact match
    //   // Check pluralized string in transcript with returned topic
    //   // Check topic with pluralized string of returned topic
    //   topic = topic.replace("?", "")
    //   .replace("#","")
    //   .replace("'","")
    //   .replace(`"`, "")
    //   .replace(".","")
    //   .replace(",", "")
    //   .replace("!","");
    //   var flag = false;
    //   if(String(this.transcript[i].topic).toLowerCase() == topic.toLowerCase()) {
    //     this.seek(this.transcript[i].start, this.transcript[i].end);
    //     this.callbacks.push(this.transcript[i]);
    //     flag = true;
    //     break;
    //   } else if(this.pluralizeString(2, String(this.transcript[i].topic).toLowerCase()) == topic.toLowerCase()) {
    //     this.seek(this.transcript[i].start, this.transcript[i].end);
    //     this.callbacks.push(this.transcript[i]);
    //     flag = true;
    //     break;
    //   } else if(String(this.transcript[i].topic).toLowerCase() == this.pluralizeString(2,topic.toLowerCase())) {
    //     this.seek(this.transcript[i].start, this.transcript[i].end);
    //     this.callbacks.push(this.transcript[i]);
    //     flag = true;
    //     break;
    //   }
    //   if(!flag) {
    //     this._api.doGetRequest("/get_saved_clips/"+topic).subscribe(res => {
    //       if(res.error == null) {
    //         this.fallbacks = res.data;
    //         let element: HTMLElement = document.getElementById('getFromArchive') as HTMLElement;
    //         element.click();
    //       }
    //     });
    //   }
    // }
  }

  seek(startTime: number, endTime: number) {
    this.isReplay = true;
    this.callStack.push(this.videoplayer.nativeElement.currentTime);
    // if(seconds === 5) {
    //   this.endTimeStack.push(8);
    // } else if(seconds === 10) {
    //   this.endTimeStack.push(18);
    // } else if(seconds === 20) {
    //   this.endTimeStack.push(35);
    // }
    this.endTimeStack.push(Math.trunc(endTime));
    this.videoplayer.nativeElement.currentTime = Math.trunc(startTime);
  }

  onVideoSourceSelected() {
    this.stripedVideoSource = this.videoSource;
    this._api.doGetRequest("/get_keywords/3. Series/20").subscribe(res => {
      this.keywords = res.data;
    });
    this.videoSource = "../../assets/" + this.videoSource;
    this.videoSource = "../../assets/3. Series.mp4";
    this.isVideoSourceSelected = true;
  }

  onVideoEnd() {
    console.log(this.callbacks);
    let element: HTMLElement = document.getElementById('addArchive') as HTMLElement;
    element.click();
    // this.videoplayer.nativeElement.pause();
    // this.videoplayer.nativeElement.stop();
  }

  addNote(callback: any) {
    if(this.noteTitle != null && this.noteTitle != "") {
      this._api.doPostRequest("/save_clip/"+this.stripedVideoSource+"/"+callback.start+"/"+callback.end+"/"+callback.topic+"/"+this.noteTitle, {}).subscribe(res => {
          if(res.error == null) {
            this.callbacks.splice(this.callbacks.indexOf(callback), 1);
            console.log("Done!");
          }
      });
    }
  }

  /**
   * Detects the file change event i.e. when user uploads
   * files through the file select window.
   * 
   * @param event 
   */
  onFileChange(event) {
    this.files = event.target.files;
    console.log(this.files[0]);
  }

  uploadVideo() {
    this.addSuccessToast("Video is scheduled for transcription tonight.");
    this.delay(5000);
    this.isVideoSourceSelected = true;
    // this._api.doPostRequest("", {}).subscribe(res => {
    //   if(res.error == null) {
    //     this.addSuccessToast("Video is scheduled for transcription tonight.");
    //     this.isVideoSourceSelected = true;
    //   } else {
    //     console.error(res.error);
    //   }
    // })
  }

  addSuccessToast(msg: string) {
    this.toastOptions.msg = msg;
    this.toastOptions.title = "Success!"
    this.toastaService.success(this.toastOptions);
  }

  addErrorToast(msg: string) {
    this.toastOptions.msg = msg;
    this.toastOptions.title = "Error!"
    this.toastaService.error(this.toastOptions);
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
  }

}
