import { buildSchema, buildProperty } from "@camberi/firecms";

type Project = {
    name: string;
    subheader: string;
    header_image: string;
    description: string;
    content: any[];
    published: boolean;
    created_at: Date;
}

export const projectSchema = buildSchema<Project>({
    name: "Project",
    properties: {
        name: {
            title: "Name",
            validation: { required: true },
            dataType: "string"
        },
        subheader: {
            title: "Technical title",
            validation: { required: false },
            dataType: "string"
        },
        header_image: {
            title: "Header Image",
            validation: { required: false },
            dataType: "string",
            config: {
                storageMeta: {
                    mediaType: "image",
                    storagePath: "images",
                    acceptedFiles: ["image/*"],
                    metadata: {
                        cacheControl: "max-age=1000000"
                    }
                }
            },
            description: "Hero Image for the project",
        },
        description: {
            title: "Description",
            validation: { required: false },
            dataType: "string"
        },
        content: buildProperty({
            title: "Content",
            validation: { required: false },
            dataType: "array",
            columnWidth: 400,
            oneOf: {
                typeField: "type",
                valueField: "value",
                properties: {
                    text: {
                        dataType: "string",
                        title: "Text",
                        config: {
                            markdown: true
                        }
                    },
                    images: {
                        title: "Images",
                        dataType: "array",
                        of: {
                            dataType: "string",
                            config: {
                                storageMeta: {
                                    mediaType: "image",
                                    storagePath: "images",
                                    acceptedFiles: ["image/*"],
                                    metadata: {
                                        cacheControl: "max-age=1000000"
                                    }
                                }
                            }
                        },
                        description: "This fields allows uploading multiple images at once and reordering"
                    },
                    video: {
                        title: "video",
                        dataType: "string",
                        of: {
                            dataType: "string",
                            config: {
                                storageMeta: {
                                    mediaType: "video",
                                    storagePath: "videos",
                                    acceptedFiles: ["video/*"],
                                    metadata: {
                                        cacheControl: "max-age=1000000"
                                    }
                                }
                            }
                        },
                    },
                }
            }
        }),
        published: {
            title: "Published",
            validation: { required: false },
            dataType: "boolean",
        },
        created_at: {
            title: "Created at",
            dataType: "timestamp",
            autoValue: "on_create"
        }
    }
});