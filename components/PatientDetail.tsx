
import React, { useState, useEffect } from 'react';
import type { Patient, TreatmentPlan, TreatmentStep } from '../types';
import { TreatmentPlanStatus, TreatmentStepStatus } from '../types';
import { generatePatientSummary, generateTreatmentOptions, generateTreatmentPlan } from '../services/geminiService';

interface PatientDetailProps {
  patient: Patient;
}

type Tab = 'Clinical' | 'AI_Insights' | 'Treatment Plans';

const getPlanStatusColor = (status: TreatmentPlanStatus) => {
    switch (status) {
        case TreatmentPlanStatus.Active: return 'bg-blue-100 text-blue-800';
        case TreatmentPlanStatus.Completed: return 'bg-green-100 text-green-800';
        case TreatmentPlanStatus.Proposed: return 'bg-yellow-100 text-yellow-800';
        case TreatmentPlanStatus.OnHold: return 'bg-gray-100 text-gray-800';
    }
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Clinical');
  const [aiSummary, setAiSummary] = useState<string>('');
  const [aiTreatmentOptions, setAiTreatmentOptions] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [localPatient, setLocalPatient] = useState(patient);

  // State for new treatment plan modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanGoal, setNewPlanGoal] = useState('');
  const [generatedSteps, setGeneratedSteps] = useState<Omit<TreatmentStep, 'id' | 'status'>[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);


  useEffect(() => {
    // Reset AI content and local data when patient changes
    setAiSummary('');
    setAiTreatmentOptions('');
    setLocalPatient(patient);
    setActiveTab('Clinical');
  }, [patient]);
  
  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setAiSummary('Generating summary...');
    const summary = await generatePatientSummary(patient);
    setAiSummary(summary);
    setIsLoading(false);
  };
  
  const handleGenerateOptions = async () => {
    setIsLoading(true);
    setAiTreatmentOptions('Generating options...');
    const options = await generateTreatmentOptions(patient);
    setAiTreatmentOptions(options);
    setIsLoading(false);
  };

  const handleGeneratePlan = async () => {
    if (!newPlanGoal) return;
    setIsGeneratingPlan(true);
    setGeneratedSteps([]);
    const steps = await generateTreatmentPlan(patient, newPlanGoal);
    setGeneratedSteps(steps);
    setIsGeneratingPlan(false);
  }

  const handleCreatePlan = () => {
    const newPlan: TreatmentPlan = {
      id: Date.now(),
      title: newPlanTitle,
      status: TreatmentPlanStatus.Proposed,
      steps: generatedSteps.map((step, index) => ({
        ...step,
        id: index + 1,
        status: TreatmentStepStatus.Pending,
      })),
      totalCost: generatedSteps.reduce((sum, step) => sum + step.cost, 0),
    };

    setLocalPatient(prev => ({
        ...prev,
        treatmentPlans: [...(prev.treatmentPlans || []), newPlan]
    }));

    // Reset modal state
    setIsModalOpen(false);
    setNewPlanTitle('');
    setNewPlanGoal('');
    setGeneratedSteps([]);
  };

  return (
    <>
    <div className="bg-surface rounded-lg shadow-md p-6 h-full flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center pb-4 border-b border-gray-200">
            <img src={patient.avatar} alt={patient.name} className="w-20 h-20 rounded-full object-cover mr-6" />
            <div>
                <h2 className="text-2xl font-bold text-gray-800">{patient.name}</h2>
                <p className="text-subtle">Next Appointment: {patient.nextAppointment || 'None Scheduled'}</p>
            </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-6">
                <button onClick={() => setActiveTab('Clinical')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'Clinical' ? 'border-primary text-primary' : 'border-transparent text-subtle hover:text-gray-700 hover:border-gray-300'}`}>
                    Clinical Overview
                </button>
                 <button onClick={() => setActiveTab('Treatment Plans')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'Treatment Plans' ? 'border-primary text-primary' : 'border-transparent text-subtle hover:text-gray-700 hover:border-gray-300'}`}>
                    Treatment Plans
                </button>
                <button onClick={() => setActiveTab('AI_Insights')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'AI_Insights' ? 'border-primary text-primary' : 'border-transparent text-subtle hover:text-gray-700 hover:border-gray-300'}`}>
                    AI Insights
                </button>
            </nav>
        </div>

        {/* Content */}
        <div className="py-4 flex-1">
            {activeTab === 'Clinical' && (
                <div className="space-y-4 text-sm">
                    <div>
                        <h4 className="font-semibold text-gray-700">Medical History</h4>
                        <p className="text-subtle mt-1 p-2 bg-gray-50 rounded">{patient.medicalHistory}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700">Dental History</h4>
                        <p className="text-subtle mt-1 p-2 bg-gray-50 rounded">{patient.dentalHistory}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700">Doctor's Notes</h4>
                        <p className="text-subtle mt-1 p-2 bg-gray-50 rounded whitespace-pre-wrap">{patient.notes}</p>
                    </div>
                </div>
            )}
            {activeTab === 'AI_Insights' && (
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-gray-700">AI-Generated Clinical Summary</h4>
                            <button onClick={handleGenerateSummary} disabled={isLoading} className="text-sm bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-600 disabled:bg-gray-400">
                                {isLoading && !aiSummary ? 'Generating...' : 'Regenerate'}
                            </button>
                        </div>
                        <div className="mt-2 p-3 bg-primary-50 rounded-md text-sm text-gray-800 min-h-[80px] whitespace-pre-wrap">
                            {aiSummary || "Click 'Generate' to create an AI summary of this patient's record."}
                        </div>
                    </div>
                    <div>
                         <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-gray-700">Suggested Treatment Options</h4>
                            <button onClick={handleGenerateOptions} disabled={isLoading} className="text-sm bg-accent text-white px-3 py-1 rounded-md hover:bg-green-600 disabled:bg-gray-400">
                                {isLoading && !aiTreatmentOptions ? 'Generating...' : 'Regenerate'}
                            </button>
                        </div>
                        <div className="mt-2 p-3 bg-green-50 rounded-md text-sm text-gray-800 min-h-[120px] whitespace-pre-wrap">
                            {aiTreatmentOptions || "Click 'Generate' to get AI-suggested treatment plans."}
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'Treatment Plans' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">Active & Proposed Plans</h3>
                        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600">
                            New Plan
                        </button>
                    </div>
                    {localPatient.treatmentPlans?.length ? localPatient.treatmentPlans.map(plan => {
                         const completedSteps = plan.steps.filter(s => s.status === TreatmentStepStatus.Completed).length;
                         const progress = (completedSteps / plan.steps.length) * 100;
                        return (
                        <div key={plan.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-gray-800">{plan.title}</h4>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPlanStatusColor(plan.status)}`}>{plan.status}</span>
                            </div>
                            <p className="text-sm text-subtle mt-1">Total Cost: ${plan.totalCost.toLocaleString()}</p>
                            <div className="mt-3">
                                <div className="flex justify-between text-sm text-subtle mb-1">
                                    <span>Progress</span>
                                    <span>{completedSteps} / {plan.steps.length} Steps</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-accent h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                {plan.steps.map(step => (
                                    <div key={step.id} className="flex items-center justify-between text-sm p-2 rounded-md bg-gray-50">
                                        <div className="flex items-center">
                                            <input type="checkbox" readOnly checked={step.status === TreatmentStepStatus.Completed} className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                                            <span className={`ml-3 ${step.status === TreatmentStepStatus.Completed ? 'line-through text-subtle' : 'text-gray-700'}`}>{step.description}</span>
                                        </div>
                                        <span className="font-medium text-gray-800">${step.cost}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}) : <p className="text-subtle text-center py-4">No treatment plans found for this patient.</p>}
                </div>
            )}
        </div>
    </div>
    {/* New Plan Modal */}
    {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-800">Create New Treatment Plan</h3>
                <div className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="planTitle" className="block text-sm font-medium text-gray-700">Plan Title</label>
                        <input type="text" id="planTitle" value={newPlanTitle} onChange={e => setNewPlanTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="e.g., Implant for #19"/>
                    </div>
                    <div>
                        <label htmlFor="planGoal" className="block text-sm font-medium text-gray-700">Clinical Goal</label>
                        <textarea id="planGoal" value={newPlanGoal} onChange={e => setNewPlanGoal(e.target.value)} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="e.g., Replace missing molar #19 with a permanent implant and crown."></textarea>
                    </div>
                    <button onClick={handleGeneratePlan} disabled={isGeneratingPlan || !newPlanGoal} className="w-full bg-primary-50 text-primary-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-100 disabled:opacity-50">
                        {isGeneratingPlan ? 'AI is Thinking...' : 'Ask AI for Plan Steps'}
                    </button>

                    {generatedSteps.length > 0 && (
                        <div className="mt-4 border-t pt-4">
                            <h4 className="font-semibold text-gray-700 mb-2">AI-Suggested Steps</h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {generatedSteps.map((step, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm p-2 rounded-md bg-gray-100">
                                        <span className="text-gray-700">{step.description}</span>
                                        <span className="font-medium text-gray-800">${step.cost}</span>
                                    </div>
                                ))}
                            </div>
                             <p className="text-right font-bold mt-2">Total Estimated Cost: ${generatedSteps.reduce((sum, s) => sum + s.cost, 0)}</p>
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleCreatePlan} disabled={!newPlanTitle || generatedSteps.length === 0} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 disabled:bg-gray-400">Create Plan</button>
                </div>
            </div>
        </div>
    )}
    </>
  );
};

export default PatientDetail;
