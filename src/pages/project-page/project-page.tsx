import {useState} from 'react';
import {FileWithPath, useDropzone} from 'react-dropzone'
import "./style.sass"
import {ButtonCmp} from "../../components/button-cmp/button-cmp"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ProjectFileDto, queryKeys, service, UploadTestFileDto} from "../../utils/service";
import {useNotification} from "../../components/base/notification/notification-provider";
import {Link, useParams} from "react-router-dom";
import LayoutCmp from "../../components/layout-cmp/layout-cmp";
import TooltipCmp from "../../components/tooltip-cmp/tooltip-cmp";
import LoaderCmp from "../../components/loader-cmp/loader-cmp";

type Category = {
    name: string
}

const CATEGORIES: Category[] = [
    {name: "CORE"},
    {name: "ПЕТРОФИЗИКА"},
    {name: "PVT"},
    {name: "СЕЙСМИКА"},
    {name: "СКВ.ИССЛЕДОВАНИЕ"}
]

const Tags = [
    {
        key: "load",
        name: "Загрузка данных"
    },
    {
        key: "test",
        name: "Тесты"
    },
    {
        key: "node",
        name: "Узлы"
    }
]

export const ProjectPage = () => {

    const queryClient = useQueryClient();
    const {id: projectId} = useParams()
    const [selectedTag, setSelectedTag] = useState("load");
    const [selectedCategory, setSelectedCategory] = useState<string>('CORE')
    const [loadedFiles, setLoadedFiles] = useState<FileWithPath[]>([])
    const [openDropdown, setOpenDropdown] = useState(false)

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
        setOpenDropdown(false)
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
                                <CategoryFiles name={"CORE"} files={projectFiles}/>
                                <CategoryFiles name={"ПЕТРОФИЗИКА"} files={[]}/>
                                <CategoryFiles name={"PVT"} files={[]}/>
                                <CategoryFiles name={"СЕЙСМИКА"} files={[]}/>
                                <CategoryFiles name={"СКВ.ИССЛЕДОВАНИЕ"} files={[]}/>
                            </div>
                            <div className={"upload-files-container"}>
                                <h4>Загрузить данные</h4>
                                <div className='dropdown-container'>
                                    <div className='dropdown' onClick={() => setOpenDropdown(!openDropdown)}>
                                        <div className='category'>
                                            {selectedCategory}
                                        </div>
                                        <div className='chevron'>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg"
                                                 className={!openDropdown ? 'arrow up' : 'arrow'}>
                                                <path
                                                    d="M3.51501 8.465L12 16.95L20.485 8.465L19.071 7.05L12 14.122L4.92901 7.05L3.51501 8.465Z"
                                                    fill="#ffffff"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div
                                        className={!openDropdown ? "dropdown-content-closed" : "dropdown-content-opened"}>
                                        {CATEGORIES.map((item) =>
                                                <span key={item.name} onClick={() => selectCategory(item.name)}>
                                    {item.name}
                                </span>
                                        )}
                                    </div>
                                </div>
                                <div {...getRootProps({className: 'dropzone'})} className='custom-dropzone'>
                                    <input {...getInputProps()} />
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
                    { selectedTag === "test" && <TestsSection/> }
                    { selectedTag === "node" && <NodesSection/> }
                </div>
            </div>
        </LayoutCmp>
    )
}

const TestsSection = () => {

    const {id: projectId} = useParams()

    const {data: projectTests, isLoading} = useQuery({
        queryKey: queryKeys.projectTests(projectId),
        queryFn: () => service.getProjectTests(projectId || ""),
        select: ({data}) => data.result,
        enabled: !!projectId
    })

    return (
        <div className={"test-container"}>
            {
                isLoading ? <LoaderCmp/> :
                projectTests?.tests.length ?
                    projectTests?.tests.map(test =>
                        <div className={"test-container__item"} key={test.test.test_id}>
                            <span className={"test-container__item__order"}>Порядок: {test.test_order}</span>
                            <h5 className={"test-container__item__name"}>{test.test.test_name}</h5>
                            <div className={"test-container__item__nodes"}>
                                {
                                    test.nodes.map(node =>
                                        <div key={node.id}>
                                            <h5>{node.name}</h5>
                                            <div>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M8 6.00067L21 6.00139M8 12.0007L21 12.0015M8 18.0007L21 18.0015M3.5 6H3.51M3.5 12H3.51M3.5 18H3.51M4 6C4 6.27614 3.77614 6.5 3.5 6.5C3.22386 6.5 3 6.27614 3 6C3 5.72386 3.22386 5.5 3.5 5.5C3.77614 5.5 4 5.72386 4 6ZM4 12C4 12.2761 3.77614 12.5 3.5 12.5C3.22386 12.5 3 12.2761 3 12C3 11.7239 3.22386 11.5 3.5 11.5C3.77614 11.5 4 11.7239 4 12ZM4 18C4 18.2761 3.77614 18.5 3.5 18.5C3.22386 18.5 3 18.2761 3 18C3 17.7239 3.22386 17.5 3.5 17.5C3.77614 17.5 4 17.7239 4 18Z"
                                                        stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"
                                                        strokeLinejoin="round"/>
                                                </svg>
                                                { Object.keys(node.values_attributes).join(",") }
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ) : <span>Доступных тестов нет</span>
            }
        </div>
    )
}

const NodesSection = () => {

    const {id: projectId} = useParams()

    const {data: projectNodes, isLoading} = useQuery({
        queryKey: queryKeys.projectNodes(projectId),
        queryFn: () => service.getProjectNodes(projectId || ""),
        select: ({data}) => data.nodes,
        enabled: !!projectId
    })

    return (
        <div className={"nodes-container"}>
            {
                isLoading ? <LoaderCmp/> :
                projectNodes?.length ?
                    projectNodes?.map(node =>
                        <div className={"nodes-container__item"} key={node.id}>
                            <span className={"nodes-container__item__domain"}>{node.domain}</span>
                            <h5 className={"nodes-container__item__name"}>{node.name}</h5>
                            <TooltipCmp direction={"bottom"} text={"Категория"}>
                                <div className={"nodes-container__item__attributes"}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 10H7C9 10 10 9 10 7V5C10 3 9 2 7 2H5C3 2 2 3 2 5V7C2 9 3 10 5 10Z" stroke="#FFFFFF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z" stroke="#FFFFFF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M17 22H19C21 22 22 21 22 19V17C22 15 21 14 19 14H17C15 14 14 15 14 17V19C14 21 15 22 17 22Z" stroke="#FFFFFF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z" stroke="#FFFFFF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    { node.category }
                                </div>
                            </TooltipCmp>
                            <TooltipCmp direction={"bottom"} text={"Атрибуты"}>
                                <div className={"nodes-container__item__attributes"}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 6.00067L21 6.00139M8 12.0007L21 12.0015M8 18.0007L21 18.0015M3.5 6H3.51M3.5 12H3.51M3.5 18H3.51M4 6C4 6.27614 3.77614 6.5 3.5 6.5C3.22386 6.5 3 6.27614 3 6C3 5.72386 3.22386 5.5 3.5 5.5C3.77614 5.5 4 5.72386 4 6ZM4 12C4 12.2761 3.77614 12.5 3.5 12.5C3.22386 12.5 3 12.2761 3 12C3 11.7239 3.22386 11.5 3.5 11.5C3.77614 11.5 4 11.7239 4 12ZM4 18C4 18.2761 3.77614 18.5 3.5 18.5C3.22386 18.5 3 18.2761 3 18C3 17.7239 3.22386 17.5 3.5 17.5C3.77614 17.5 4 17.7239 4 18Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    { node.attributes.join(",") }
                                </div>
                            </TooltipCmp>
                        </div>
                    ) :
                    <span>Доступных узлов нет</span>
            }
        </div>
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