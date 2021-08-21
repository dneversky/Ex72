export class FilesLoader {

    public files = [];
    public oldFiles = [];
    public dataTransfer = new DataTransfer();

    public loadFiles(event: any) {

        if (event.target.files && event.target.files[0]) {

            for(const file of event.target.files) {

                let ext = file.name.match(/\.([^\.]+)$/)[1];

                switch (ext) {
                    case 'xlsx':
                    case 'xls':
                        this.files.push({ icon: 'images/excel.png', name: file.name });
                        break;
                    case 'doc':
                    case 'docx':
                        this.files.push({ icon: 'images/word.png', name: file.name });
                        break;
                    case 'ppt':
                    case 'pptx':
                        this.files.push({ icon: 'images/point.png', name: file.name });
                        break;
                    case 'pdf':
                        this.files.push({ icon: 'images/pdf.png', name: file.name });
                        break;
                    case 'xml':
                    case 'txt':
                        this.files.push({ icon: 'images/file.png', name: file.name });
                        break;
                    default:
                        continue;
                }

                this.dataTransfer.items.add(file);
            }

            event.target.files = this.dataTransfer.files;
        }
    }

    public removeFile(file, index) {
        this.dataTransfer.items.remove(index);
        this.files = this.files.filter(x => x != file);
    }

    public removeFilesList: string[] = [];

    remFile(event: any, file: any) {
        if (event.target.hasAttribute('remove')) {
            event.target.removeAttribute('remove');
            this.removeFilesList = this.removeFilesList.filter(x => x != file);
            event.target.style.opacity = '1';
        } else {
            event.target.setAttribute('remove', null);
            this.removeFilesList.push(file);
            event.target.style.opacity = '0.5';
        }
    }
}