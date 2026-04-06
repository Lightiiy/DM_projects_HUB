import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'dm-file-input',
  imports: [],
  templateUrl: './file-input.html',
  styleUrl: './file-input.scss',
})
export class FileInput {
  @Output() fileLoaded = new EventEmitter<string>();

  onFileChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;

    if(fileList && fileList.length > 0)
    {
      const reader = new FileReader();
      reader.onload = (event) => {
        const raw = JSON.parse(event.target?.result as string); 

        // const validatedGraph: Graph = {
        //   nodes: raw.nodes.map((nodes: any) => ({
        //     ...nodes,
        //     part
        //   }))
        // }

        // this.fileLoaded.emit(content);
      }
      reader.readAsText(fileList[0]);
    }
  }
}
