document.addEventListener("DOMContentLoaded", SaveSections);

let videoSection = 0;
let projectsSection = 0;
let curriculumSection = 0;

function SaveSections(){
    videoSection = document.getElementById("DemoReelSection");
    projectsSection = document.getElementById("projectsSection");
    
    document.getElementById("sectionsContainer").removeChild(projectsSection);
}

function showDemoReel(){
    if (videoSection == 0) return;

    let child = document.getElementById("sectionsContainer").lastChild;

    if (child == null) return;

    document.getElementById("sectionsContainer").removeChild(child);
    document.getElementById("sectionsContainer").append(videoSection);
}

function showDemoProjects(){
    if (projectsSection == 0) return;

    let child = document.getElementById("sectionsContainer").lastChild;

    if (child == null) return;

    document.getElementById("sectionsContainer").removeChild(child);
    document.getElementById("sectionsContainer").append(projectsSection);
}