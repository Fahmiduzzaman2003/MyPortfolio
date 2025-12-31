import { useQuery } from '@tanstack/react-query';
import { profileApi, educationApi, skillsApi, projectsApi, researchApi, achievementsApi, messagesApi, codingPlatformsApi, coCurricularApi, experienceApi, contactInfoApi } from '@/lib/api';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.get,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });
};

export const useEducation = () => {
  return useQuery({
    queryKey: ['education'],
    queryFn: educationApi.getAll,
  });
};

export const useSkillCategories = () => {
  return useQuery({
    queryKey: ['skillCategories'],
    queryFn: skillsApi.getCategories,
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });
};

export const useResearch = () => {
  return useQuery({
    queryKey: ['research'],
    queryFn: researchApi.getAll,
  });
};

export const useAchievements = () => {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: achievementsApi.getAll,
  });
};

export const useContactMessages = () => {
  return useQuery({
    queryKey: ['contact_messages'],
    queryFn: messagesApi.getAll,
    retry: 1,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });
};

export const useCodingPlatforms = () => {
  return useQuery({
    queryKey: ['coding_platforms'],
    queryFn: codingPlatformsApi.getAll,
  });
};

export const useCoCurricular = () => {
  return useQuery({
    queryKey: ['co_curricular'],
    queryFn: coCurricularApi.getAll,
  });
};

export const useExperience = () => {
  return useQuery({
    queryKey: ['experience'],
    queryFn: experienceApi.getAll,
  });
};

export const useContactInfo = () => {
  return useQuery({
    queryKey: ['contact_info'],
    queryFn: contactInfoApi.getAll,
  });
};
