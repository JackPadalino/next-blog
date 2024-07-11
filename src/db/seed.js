import dotenv from "dotenv";
dotenv.config();
import path from "path";

// Config for Firebase
import {
  Firestore,
  // FieldValue
} from "@google-cloud/firestore";
// setting the env variable to store the file path to the
// service account credentials.json file
// do this to set up the firestore client
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(
  process.cwd(),
  "credentials.json"
);
const firestoreClient = new Firestore();

// Config for Google Gemini - to generate text embeddings
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY);
const gemini = genAI.getGenerativeModel({ model: "embedding-001" });

// Seed posts
const seedPosts = [
  {
    title: "Helping Students with Anger Management Issues",
    userId: "BjBcZLU0k8RMqurRZYapWtLTXSs2",
    content:
      "Children who struggle with managing their emotions may direct their distress at caregivers, exhibiting behaviors like screaming, cursing, throwing objects, or physical aggression. This can be a frightening and stressful experience for both the child and the caregiver. It's important to understand that such behavior is a form of communication from a distressed child who lacks the skills to express their feelings in a more mature manner.\n\nRecognizing that children who lash out are often unable to manage frustration or anger effectively is crucial. They may lack language skills, impulse control, or problem-solving abilities. Although such explosive behavior can be perceived as manipulative, it's usually a sign that the child is overwhelmed and doesn't know how to handle their emotions.\n\nHow caregivers respond to a child's outburst can influence whether the child continues to respond in the same way or learns better ways to manage their feelings. It's essential to stay calm, as yelling can escalate the child's aggression and defiance. Instead, being a calm model can teach the child to control their emotions. It's also important not to give in to the child's demands during an outburst, as this can reinforce the behavior. Praising the child for calming down and expressing feelings verbally or finding compromises encourages positive behavior.\n\nHelping children practice problem-solving skills when they are calm is beneficial. This can involve discussing feelings and brainstorming solutions to conflicts before they escalate. Time outs can be effective for younger children, while older children might benefit more from positive reinforcement systems, such as earning points or tokens for appropriate behavior. Additionally, avoiding triggers for meltdowns by giving time warnings, breaking tasks into simple steps, and preparing the child for upcoming situations can help prevent outbursts.",
  },
  {
    content:
      "Students with autism can thrive in the classroom with strategies such as using an assignment notebook, maintaining routines, and creating a supportive classroom environment. An assignment notebook helps students keep track of tasks, while a consistent routine provides stability. Structuring the classroom to limit sensory overload, such as minimizing loud noises and certain light frequencies, can help reduce anxiety and agitation for students with autism.\n\nCommunication is another critical strategy. Clear and simple instructions help students with autism process information better, avoiding confusion. It's important to avoid figurative language and provide direct, short tasks to ensure they understand and can complete their assignments.\n\nSetting up the classroom with environmental supports like labels, visual schedules, and designated calm-down areas can enhance predictability and aid in self-regulation. These supports help students with autism understand their environment and expectations, increasing their ability to learn and participate.\n\nSensory activities such as using fidget toys, slime play, or rhythm instruments can help students with autism focus and stay grounded. Identifying the right sensory activities for each student is crucial, as different students have unique needs and responses. Overall, individualized strategies that reflect the unique needs of each student with autism are essential for their success in the classroom.",
    userId: "BjBcZLU0k8RMqurRZYapWtLTXSs2",
    title: "Working with Students and Autism",
  },
  {
    title: "Helping Students with Dyslexia",
    userId: "BjBcZLU0k8RMqurRZYapWtLTXSs2",
    content:
      "Students with dyslexia can thrive in school with the right support and teaching strategies that accommodate their unique learning needs. Multisensory learning, which engages visual, auditory, and kinesthetic senses, helps students with dyslexia understand and retain information. Activities like sand writing, blending boards, and arm tapping are effective in reinforcing learning through multiple sensory inputs.\n\nAssistive technology also plays a crucial role in supporting students with dyslexia. Tools such as pocket spellcheckers, line readers, and digital scanning pens help students overcome challenges in reading and writing, enabling them to keep pace with their peers. These technologies provide instant feedback, aid in focus, and facilitate better comprehension.\n\nAppropriate accommodations, often outlined in Individualized Education Programs (IEPs), are essential for students with dyslexia. Accommodations may include extended test times, oral responses instead of written ones, and quiet study spaces. Additionally, teachers can support dyslexic students by preteaching vocabulary, providing lesson outlines, and using clear, step-by-step instructions.\n\nEmpowering students with dyslexia requires educators to be well-trained in inclusive teaching strategies. By employing these methods, teachers can create a supportive learning environment that enables dyslexic students to succeed academically. Programs like American University’s online Master of Arts in Teaching prepare educators to effectively support and empower all students, including those with dyslexia.",
  },
  {
    title: "Students and ADHD",
    userId: "BjBcZLU0k8RMqurRZYapWtLTXSs2",
    content:
      "Understanding and selecting the right accommodations for students with ADHD is essential for a successful college career. Common accommodations include extended exam times, note-taking assistance, technology aids, course load modifications, and recorded lectures. These options are designed to help students focus, manage time effectively, and adapt to non-traditional learning environments.\n\nEach college has its own support program, and the availability of accommodations can vary. It's crucial for students to contact their school directly to understand the specific support options and their extent. Extended exam time, for instance, helps students manage distractions and reduce anxiety, while designated note-takers ensure that students do not miss important information during lectures.\n\nTechnological aids such as text-to-speech and speech-to-text programs can help students with ADHD by transcribing lectures and assisting with writing assignments. Adjusting course loads and providing priority registration can also support students in managing their schedules more effectively. Additionally, recording lectures allows students to revisit class material at their own pace, enhancing their understanding and retention.\n\nBeyond these common accommodations, other useful options include allowing course substitutions, providing quiet exam environments, maintaining predictable schedules, and seeking input from medical professionals. These strategies collectively ensure that students with ADHD receive comprehensive support tailored to their individual needs.",
  },
  {
    title: "Angry Kids: Working with Students with Explosive Behavior",
    content:
      "It's common for children who struggle to manage their emotions to lose control and direct their distress at a caregiver through screaming, cursing, throwing objects, or even physical aggression. This experience can be quite stressful and frightening for both the child and the caregiver. Typically, after these episodes, children often feel remorseful once they have calmed down.\n\nUnderstanding that behavior is a form of communication is essential. A child lashing out is usually overwhelmed and lacks the skills to express their feelings maturely. They might struggle with language, impulse control, or problem-solving abilities. It's a sign of distress, not manipulation, as some parents might assume. These children often cannot handle frustration or anger effectively.\n\nHow you respond to such behavior can influence whether the child continues to react similarly or learns better coping mechanisms. Staying calm is crucial, as yelling can escalate the child's aggression and defiance. Instead, model calm behavior to teach them emotional control. Avoid giving in to their demands, as this reinforces the behavior. Praise them when they manage their emotions appropriately and practice problem-solving skills when they are calm.\n\nFor younger children, time-outs can be effective if used consistently and balanced with positive reinforcement. For older children, reward systems might work better. Avoiding known triggers and preparing the child for transitions can help reduce meltdowns. Understanding the severity of tantrums is also important; while nonviolent outbursts can often be ignored, physical aggression requires immediate and safe intervention. Balancing these strategies with professional help, such as behavioral therapies, can significantly improve your child's ability to manage their emotions.",
    userId: "BjBcZLU0k8RMqurRZYapWtLTXSs2",
  },
  {
    content:
      'Assigning work that suits the student\'s skill level is crucial for students with ADHD, as they often avoid tasks that are too difficult or lengthy. Offering choices can significantly improve their engagement and compliance; for example, providing a list of 15 different activities for practicing spelling words, such as writing words on flashcards or using them in a sentence. Visual reminders are also effective; demonstrating skills on an overhead projector or board and leaving key points visible can help these students better understand and retain information.\n\nIncreasing active class participation through group strategies can also benefit students with ADHD. Methods like using dry-erase boards for answers, choral responses, or thumbs up/down responses can keep them engaged. Paired learning, where students work through problems in groups, can maximize understanding. Additionally, encouraging hands-on learning experiences, such as writing and acting out plays or using models to study complex topics, can make learning more tangible and memorable for these students.\n\nEstablish Rules & Routines for ADHD Students\nPosting classroom rules that are clear and positive, and involving students in creating these rules, can help maintain order. For instance, instead of saying, "No loud talking when you come into class," you can say, "When you come into class, check the assignment on the board and start working quietly." Establishing consistent classroom routines, such as always writing homework on the board and having "row captains" ensure assignments are written down, can help students with ADHD stay organized. Additionally, pairing them with classmates for supervision and involving classroom aides can provide the extra support they need.\n\nOffer Accommodations for ADHD in the Classroom\nProviding appropriate accommodations is essential for helping students with ADHD succeed academically. This can include extended time on tests, shortened assignments, and segmented long-term projects with separate due dates. Reducing potential distractions by seating students near the source of instruction and encouraging positive peer models can also be beneficial. Allowing for movement, such as running errands or using a soft squeeze ball, can help these students manage their need for physical activity. Lastly, focusing on positive interactions, providing frequent feedback, and partnering with parents can create a supportive environment that encourages students with ADHD to thrive.',
    title: "Strategies for Students with ADHD",
    userId: "BjBcZLU0k8RMqurRZYapWtLTXSs2",
  },
  {
    userId: "BjBcZLU0k8RMqurRZYapWtLTXSs2",
    content:
      'Providing Emotional Support\n\nStudents with anxiety benefit from having self-calming techniques and objects available, such as family pictures or a calming object. Regular check-ins to gauge understanding and emotional state are crucial. Allowing breaks to call home can help students with separation anxiety. Providing access to a designated staff member with mental health expertise for support during anxious moments is also beneficial.\n\nClassroom Setup, Schedules, and Routines\n\nClear communication of classroom expectations and consequences is essential. Students should be allowed to sit where they feel most comfortable, whether near a teacher, friend, or by an exit during assemblies. Providing a "take a break" pass for brief exits can help manage stress. Assigning a buddy for social times and preferential grouping on field trips offers additional support. A plan for catching up after absences, advance notice of routine changes, and rehearsing transitions can ease anxiety. Use signals to notify students before calling on them and allow them to opt out of answering.\n\nCompleting Assignments and Tests\n\nBreaking assignments into smaller chunks and using both oral and written instructions can aid comprehension. Exempting students from reading aloud or presenting in front of the class reduces anxiety. Extended test times, separate test spaces, and the use of word banks, notes, and fact cards can help during exams. Setting time limits on homework and ensuring incomplete work doesn’t count against the student reduces stress. Providing class notes and advance notice of tests, avoiding "pop quizzes," can further support anxious students.\n\nCollaboration with Mental Health Providers\n\nRegular communication between school staff and the student’s mental health care provider ensures that strategies and accommodations are effective and appropriately tailored to the student’s needs. This collaboration helps create a supportive and understanding environment for the student.',
    title: "Helping Anxious Students",
  },
  {
    userId: "BjBcZLU0k8RMqurRZYapWtLTXSs2",
    title: "Tips for Teaching Students with Autsim",
    content:
      "With the ever-growing population of children with autism, it's so important that all educators are well-versed on their needs. Here are six tips to help your students with autism thrive in the classroom.  Avoid sensory overload. Many unexpected things can be distracting to students with autism. Fluorescent lights, smells, and noises from other students can make it difficult for students with autism to concentrate. Using cool, calm colors in the classroom can help create a more relaxing atmosphere. Avoid covering the walls with too many posters or other things to look at. Some students may even benefit from their own center, where they can spend time away from any possible distractions.  Use visuals. Even individuals with autism who can read benefit from visuals. Visuals can serve as reminders about classroom rules, where certain things go, and resources that are available to students. Using pictures and modeling will mean more to students with autism than a lengthy explanation.  Be predictable. If you've ever been a substitute teacher, you know about the unspoken anxiety of being with a different class (sometimes in a different school) every day.  Having predictability in the classroom eases anxiety for students with autism and will help avoid distraction. Students are less worried or curious about what will happen next and can better focus on the work at hand. Give your student a schedule that they can follow. If there are any unpredictable changes, it’s a great teaching moment to model how to handle changes appropriately.  Keep language concrete. Do any of you children of the 90’s remember the show “Bobby’s World” with Howie Mandell?  Bobby would always overhear adults using figurative language and daydream of all these crazy scenarios about what he thought they meant. Many individuals with autism have trouble understanding figurative language and interpret it in very concrete terms. This may serve as a great opportunity to teach figurative language and hidden meanings in certain terms.  Directly teach social skills. The hidden curriculum may be too hidden for some individuals with autism. There are certain things that may have to be explicitly taught (like analogies). Model appropriate social skills and discuss how our behavior can make others feel.  Social Thinking is a great curriculum with pictures books such as You Are a Social Detective that explain social skills in an easy to understand way.  Treat students as individuals. I’m sure this goes without saying, but I’m going to say it: It’s so important to model patience, understanding, and respect when working in a classroom with any special learners. Celebrate their success and don’t sweat it if some accommodations don’t conform to what you are used to in the classroom. Keep in mind that some of these recommendations may be super helpful for some students, while others may not need the same degree of consideration. Autism can affect individuals differently.",
  },
];

const postsRef = firestoreClient.collection("posts");

for (const post of seedPosts) {
  const geminiResponse = await gemini.embedContent(post.content);
  const embedding = geminiResponse.embedding.values;
  // calculating embeddings array magnitude
  // sum of the squares of each component
  const sumOfSquares = embedding.reduce((sum, value) => sum + value * value, 0);
  const embeddingMag = Math.sqrt(sumOfSquares);
  /**
  have to comment this out - to perform the cosine similarity
  calculation in the search api endpoint the embedding must
  be a plain array - not a FieldValue type
  */
  // post.embedding = FieldValue.vector(embedding);
  post.embedding = embedding;
  post.embeddingMag = embeddingMag;
  await postsRef.add(post);
}
