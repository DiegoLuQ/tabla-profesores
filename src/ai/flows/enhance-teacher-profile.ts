'use server';

/**
 * @fileOverview A teacher profile enhancement AI agent.
 *
 * - enhanceTeacherProfile - A function that handles the teacher profile enhancement process.
 * - EnhanceTeacherProfileInput - The input type for the enhanceTeacherProfile function.
 * - EnhanceTeacherProfileOutput - The return type for the enhanceTeacherProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceTeacherProfileInputSchema = z.object({
  nombre_completo: z.string().describe('The full name of the teacher.'),
  asignaturas: z.array(z.string()).describe('The subjects taught by the teacher.'),
  colegios: z.array(z.string()).describe('The schools where the teacher has worked.'),
  curso: z.string().describe('The course or grade level the teacher teaches.'),
  email: z.string().email().describe('The email address of the teacher.'),
});
export type EnhanceTeacherProfileInput = z.infer<typeof EnhanceTeacherProfileInputSchema>;

const EnhanceTeacherProfileOutputSchema = z.object({
  suggestions: z.array(
    z.string().describe('A suggestion for improving the teacher profile.')
  ).describe('Suggestions for improving the teacher profile based on current educational standards.'),
});
export type EnhanceTeacherProfileOutput = z.infer<typeof EnhanceTeacherProfileOutputSchema>;

export async function enhanceTeacherProfile(
  input: EnhanceTeacherProfileInput
): Promise<EnhanceTeacherProfileOutput> {
  return enhanceTeacherProfileFlow(input);
}

const enhanceTeacherProfilePrompt = ai.definePrompt({
  name: 'enhanceTeacherProfilePrompt',
  input: {schema: EnhanceTeacherProfileInputSchema},
  output: {schema: EnhanceTeacherProfileOutputSchema},
  prompt: `You are an AI assistant designed to provide suggestions for improving teacher profiles based on current educational standards.

  Review the following teacher profile and provide specific, actionable suggestions on how to improve it. Focus on completeness, relevance to current educational trends, and attractiveness to potential schools.

  Teacher Profile:
  - Full Name: {{{nombre_completo}}}
  - Subjects: {{#each asignaturas}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - Schools: {{#each colegios}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - Course: {{{curso}}}
  - Email: {{{email}}}

  Suggestions:
  `,
});

const enhanceTeacherProfileFlow = ai.defineFlow(
  {
    name: 'enhanceTeacherProfileFlow',
    inputSchema: EnhanceTeacherProfileInputSchema,
    outputSchema: EnhanceTeacherProfileOutputSchema,
  },
  async input => {
    const {output} = await enhanceTeacherProfilePrompt(input);
    return output!;
  }
);
