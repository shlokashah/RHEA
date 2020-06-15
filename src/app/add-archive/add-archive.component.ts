import { Component, OnInit, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ApiCallerService } from '../api-caller.service';

@Component({
  selector: 'app-add-archive',
  providers: [ ApiCallerService ],
  templateUrl: './add-archive.component.html',
  styleUrls: ['./add-archive.component.css']
})
export class AddArchiveComponent implements OnInit {

  videoSource: string;
  archives: Array<any> = new Array();
  @ViewChildren('videoPlayer') videoplayer: QueryList<ElementRef>;
  currentPlayer: ElementRef;

  constructor(private _api: ApiCallerService) { }

  ngOnInit() {
    this._api.doGetRequest("/get_all_saved_clips").subscribe(res => {
      if(res.error == null) {
        this.archives = res.data;
      }
    });
  }

  onPreviewClicked(archive: any) {
    console.log(archive);
    this.videoSource = "../../assets/"+archive.video_title+".mp4";
    // let element: HTMLMediaElement = document.getElementById('videoPlayer') as HTMLMediaElement;
    // if(element != null) {
    //   element.currentTime = Math.trunc(archive.start_time);
    // } else {
    //   element = document.getElementById('videoPlayer') as HTMLMediaElement;
    //   element.currentTime = Math.trunc(archive.start_time);
    // }
    if(this.currentPlayer != null) {
      this.currentPlayer.nativeElement.currentTime = Math.trunc(archive.start_time);
    } else {
      this.videoplayer.changes.subscribe(archiveCh => {
        this.currentPlayer = archiveCh.first;
        this.currentPlayer.nativeElement.currentTime = Math.trunc(archive.start_time);
      });
    }
  }

  closePreview() {
    this.currentPlayer.nativeElement.pause();
    this.currentPlayer.nativeElement.currentTime = 0;
  }

}
