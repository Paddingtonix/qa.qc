import {useState} from 'react';
import {FileWithPath, useDropzone} from 'react-dropzone'
import "./style.sass"
import {ButtonCmp} from "../../components/button-cmp/button-cmp"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ProjectFileDto, queryKeys, service, UploadTestFileDto} from "../../utils/api/service";
import {useNotification} from "../../components/base/notification/notification-provider";
import {Link, useParams} from "react-router-dom";
import LayoutCmp from "../../components/layout-cmp/layout-cmp";
import LoaderCmp from "../../components/loader-cmp/loader-cmp";
import DropdownCmp from "../../components/dropdown-cmp/dropdown-cmp";


const CATEGORIES = [
    { key: "Core", title: "Core" },
    { key: "Данные ГИС", title: "Данные ГИС" },
    { key: "РИГИС", title: "РИГИС" },
    { key: "All", title: "All" },
]

const Tags = [
    {
        key: "load",
        name: "Загрузка данных"
    },
    {
        key: "files",
        name: "Файлы"
    },
    {
        key: "data",
        name: "Загруженные данные"
    }
]

export const ProjectPage = () => {

    const queryClient = useQueryClient();
    const {id: projectId} = useParams()
    const [selectedTag, setSelectedTag] = useState("load");
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
    const [loadedFiles, setLoadedFiles] = useState<FileWithPath[]>([])


    const {toastSuccess, toastWarning} = useNotification();

    const {data: projectFiles, isLoading} = useQuery({
        queryKey: queryKeys.projectFiles(projectId),
        queryFn: () => service.getProjectFiles(projectId || ""),
        select: ({data}) => data.files,
        enabled: !!projectId
    })

    const {mutate: uploadFile} = useMutation({
        mutationFn: (data: UploadTestFileDto) => service.uploadTestFile(data),
        onSuccess: ({data}) => {
            queryClient.invalidateQueries({queryKey: queryKeys.projectFiles(projectId)})
            queryClient.invalidateQueries({queryKey: queryKeys.projectNodes(projectId)})
            queryClient.invalidateQueries({queryKey: queryKeys.projectTests(projectId)})
            if (data.date.errorNodes)
                toastWarning(`Файл загружен с ошибками: ${data.date.errorNodes}`);
            else toastSuccess("Файл загружен без ошибок");
        }
    });

    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        },
        onDrop: (acceptedFiles: File[]) => {
            const files_: FileWithPath[] = acceptedFiles.map((file: FileWithPath) => ({
                ...file
            }));
            setLoadedFiles(files_)
        }
    });

    const selectCategory = (name: string) => {
        setSelectedCategory(name)
    }

    const onUpload = () => {
        uploadFile({
            projectID: projectId || "",
            file: acceptedFiles[0]
        })
        setLoadedFiles([]);
    }

    return (
        <LayoutCmp>
            <div className="project-page">
                <div className={"project-page__header"}>
                    <h2>Project name</h2>
                    <h5>Загрузите данные для тестирования</h5>
                    <div className={"tags"}>
                        {
                            Tags?.map(tag =>
                                <div key={tag.key}
                                     className={`tags__item ${tag.key === selectedTag ? "tags__item_selected" : null}`}
                                     onClick={() => setSelectedTag(tag.key)}
                                >
                                    {tag.name}
                                </div>)
                        }
                    </div>
                </div>
                <div className={"project-content"}>
                    {
                        isLoading ? <LoaderCmp/> :
                        selectedTag === "load" &&
                        <>
                            <div className={"categories-files-container"}>
                                <CategoryFiles name={"Core"} files={projectFiles}/>
                                <CategoryFiles name={"Данные ГИС"} files={[]}/>
                                <CategoryFiles name={"РИГИС"} files={[]}/>
                                <CategoryFiles name={"All"} files={[]}/>
                            </div>
                            <div className={"upload-files-container"}>
                                <h4>Загрузить данные</h4>
                                <DropdownCmp
                                    items={CATEGORIES}
                                    defaultValue={selectedCategory}
                                    placeholder={"Выберете категорию"}
                                    onSelect={(key: string) => selectCategory(key)}
                                />
                                <div {...getRootProps({className: 'dropzone'})} className='custom-dropzone'>
                                    <input {...getInputProps()}/>
                                    <span>Выберите или<br/>перетащите файл в поле</span>
                                </div>
                                <div className='files-container'>
                                    {
                                        loadedFiles.map((file: FileWithPath, index) => (
                                            <FileCard name={file.path} size={file.size} key={index}/>
                                        ))
                                    }
                                </div>
                                {
                                    loadedFiles.length ?
                                        <>
                                            <ButtonCmp onClick={onUpload}>Загрузить</ButtonCmp>
                                            <ButtonCmp onClick={() => setLoadedFiles([])} type={"secondary"}>Отмена</ButtonCmp>
                                        </>
                                        : null
                                }
                            </div>
                        </>
                    }
                </div>
            </div>
        </LayoutCmp>
    )
}

interface CategoryFilesProps {
    name?: string,
    files?: ProjectFileDto[],
}

const CategoryFiles = ({name, files}: CategoryFilesProps) => {

    const [isOpen, setOpen] = useState(false);

    return (
        <div className={`category-files ${isOpen ? "category-files_open" : ""}`}>
            <span onClick={() => setOpen(!isOpen)}>
                {name}
                <div className={"category-files__dropdown"}>
                    <div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2H13C13.0109 2.00047 13.0217 2.00249 13.032 2.006C13.0418 2.00902 13.0518 2.01103 13.062 2.012C13.1502 2.01765 13.2373 2.0348 13.321 2.063L13.349 2.072C13.3717 2.07968 13.3937 2.08904 13.415 2.1C13.5239 2.14842 13.6232 2.21618 13.708 2.3L19.708 8.3C19.7918 8.38479 19.8596 8.48406 19.908 8.593C19.918 8.615 19.925 8.638 19.933 8.661L19.942 8.687C19.9699 8.77039 19.9864 8.85718 19.991 8.945C19.9926 8.95418 19.9949 8.96322 19.998 8.972C19.9998 8.98122 20.0004 8.99062 20.0001 9V20C20.0001 21.1046 19.1046 22 18 22ZM6 4V20H18V10H13C12.4477 10 12 9.55228 12 9V4H6ZM14 5.414V8H16.586L14 5.414Z"
                                fill="#8d8d8d"/>
                        </svg>
                            {files?.length}
                    </div>
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3.51501 8.465L12 16.95L20.485 8.465L19.071 7.05L12 14.122L4.92901 7.05L3.51501 8.465Z"
                            fill="#ffffff"/>
                    </svg>
                </div>

            </span>
            <div className={`category-files__list ${isOpen ? "category-files__list_open" : ""}`}>
                {
                    files?.length ?
                        files?.map((file, index) =>
                            <FileCard name={file.name} path={file.path} key={index}/>)
                        : <span>Файлов нет</span>
                }
            </div>
        </div>
    )
}

interface FileCardProps {
    name?: string,
    path?: string
    size?: number
}

const FileCard = ({name, path, size}: FileCardProps) => {
    return (
        <div className='file-card'>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2H13C13.0109 2.00047 13.0217 2.00249 13.032 2.006C13.0418 2.00902 13.0518 2.01103 13.062 2.012C13.1502 2.01765 13.2373 2.0348 13.321 2.063L13.349 2.072C13.3717 2.07968 13.3937 2.08904 13.415 2.1C13.5239 2.14842 13.6232 2.21618 13.708 2.3L19.708 8.3C19.7918 8.38479 19.8596 8.48406 19.908 8.593C19.918 8.615 19.925 8.638 19.933 8.661L19.942 8.687C19.9699 8.77039 19.9864 8.85718 19.991 8.945C19.9926 8.95418 19.9949 8.96322 19.998 8.972C19.9998 8.98122 20.0004 8.99062 20.0001 9V20C20.0001 21.1046 19.1046 22 18 22ZM6 4V20H18V10H13C12.4477 10 12 9.55228 12 9V4H6ZM14 5.414V8H16.586L14 5.414Z"
                    fill="#8d8d8d"/>
            </svg>
            <div className='file-card__info'>
                {
                    path ? <Link to={path} target={"_blank"}>{name}</Link> : <h5>{name}</h5>
                }
                <div>
                    <span>{`${getExtension(name)} | `}</span>
                    <span>{size || "-"} Байт</span>
                </div>
            </div>
        </div>
    )
}


//Получение типа файла
function getExtension(file_name: string | undefined) {
    return file_name?.split('.').reverse()[0].toUpperCase();
}