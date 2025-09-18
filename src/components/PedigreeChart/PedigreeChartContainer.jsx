"use client"

import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Calendar, Crown, Award, Info } from 'lucide-react';

// Custom Node Component for Pigeon Pedigree
const PigeonNode = ({ data }) => {
  const getGenderIcon = (gender) => {
    return gender === 'male' ? '♂' : '♀';
  };

  const getGenderColor = (gender) => {
    return gender === 'male' ? 'bg-blue-500' : 'bg-pink-500';
  };

  const getGenerationColor = (generation) => {
    switch (generation) {
      case 0: return 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-400'; // Subject
      case 1: return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300';      // Parents (2)
      case 2: return 'bg-gradient-to-br from-green-50 to-green-100 border-green-300';   // Grandparents (4)
      case 3: return 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300'; // Great-grandparents (8)
      case 4: return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300'; // Great-great-grandparents (16)
      default: return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300';
    }
  };

  const getCardSize = (generation) => {
    switch (generation) {
      case 0: return 'w-72 h-40'; // Subject - largest
      case 1: return 'w-64 h-36'; // Parents
      case 2: return 'w-56 h-32'; // Grandparents  
      case 3: return 'w-48 h-28'; // Great-grandparents
      case 4: return 'w-40 h-24'; // Great-great-grandparents - smallest
      default: return 'w-40 h-24';
    }
  };

  return (
    <Card className={`${getCardSize(data.generation)} shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${getGenerationColor(data.generation)} border-2`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-slate-400" />
      
      <CardHeader className="pb-2 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-3 h-3 text-amber-600" />
            <h3 className="font-bold text-xs text-gray-900 truncate">{data.name}</h3>
          </div>
          <Badge className={`${getGenderColor(data.gender)} text-white text-xs px-1 py-0.5`}>
            {getGenderIcon(data.gender)}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs px-1">
            Gen {data.generation}
          </Badge>
          <Badge variant="secondary" className="text-xs px-1">
            {data.position}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 p-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <User className="w-3 h-3" />
            <span className="truncate">{data.owner}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>{data.birthYear}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className={`w-3 h-3 rounded-full ${data.color}`}></div>
            <span className="truncate">{data.colorName}</span>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-5 w-full text-xs mt-1 p-0">
                <Info className="w-3 h-3 mr-1" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-600" />
                  {data.name}
                  <Badge className={`${getGenderColor(data.gender)} text-white`}>
                    {getGenderIcon(data.gender)}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold">Owner</p>
                    <p className="text-xs text-gray-600">{data.owner}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Birth Year</p>
                    <p className="text-xs text-gray-600">{data.birthYear}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-semibold">Position</p>
                  <p className="text-xs text-gray-600">{data.position}</p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold">Color</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${data.color}`}></div>
                    <p className="text-xs text-gray-600">{data.colorName}</p>
                  </div>
                </div>
                
                {data.achievements && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-amber-600" />
                      <p className="text-sm font-semibold">Achievements</p>
                    </div>
                    <p className="text-xs text-gray-600">{data.achievements}</p>
                  </div>
                )}
                
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-700">{data.description}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-slate-400" />
    </Card>
  );
};

const nodeTypes = {
  pigeonNode: PigeonNode,
};

export default function PigeonPedigreeChart() {
  // Left to Right flow: Subject on left, ancestors flowing to the right
  const initialNodes = [
    // Generation 0 - Subject (1 pigeon) - Now on the LEFT
    {
      id: 'subject',
      type: 'pigeonNode',
      position: { x: 100, y: 500 },
      data: {
        name: 'Blue Thunder Champion',
        owner: 'Jon Johnson',
        gender: 'male',
        generation: 0,
        position: 'Subject',
        birthYear: '2020',
        color: 'bg-blue-600',
        colorName: 'Blue Bar',
        description: 'Championship winning pigeon with exceptional racing performance and breeding capabilities.',
        achievements: 'First place in National Championship 2023, Multiple race winner'
      },
    },

    // Generation 1 - Parents (2 pigeons: 1 father + 1 mother) - Moving RIGHT
    {
      id: 'father_1',
      type: 'pigeonNode',
      position: { x: 450, y: 400 },
      data: {
        name: 'Thunder King',
        owner: 'Jon Johnson',
        gender: 'male',
        generation: 1,
        position: 'Father',
        birthYear: '2018',
        color: 'bg-blue-700',
        colorName: 'Dark Blue',
        description: 'Proven breeding cock with excellent offspring performance record.',
        achievements: 'Champion breeder, Father of multiple winners'
      },
    },
    {
      id: 'mother_1',
      type: 'pigeonNode',
      position: { x: 450, y: 600 },
      data: {
        name: 'Royal Belle',
        owner: 'Jon Johnson',
        gender: 'female',
        generation: 1,
        position: 'Mother',
        birthYear: '2019',
        color: 'bg-red-500',
        colorName: 'Red Checker',
        description: 'Outstanding hen with strong maternal instincts and racing bloodline.',
        achievements: 'Best breeding hen award, Consistent producer'
      },
    },

    // Generation 2 - Grandparents (4 pigeons: 2 fathers + 2 mothers) - Further RIGHT
    {
      id: 'father_2_1', // Father of father_1
      type: 'pigeonNode',
      position: { x: 800, y: 300 },
      data: {
        name: 'Storm Lightning',
        owner: 'Jon Johnson',
        gender: 'male',
        generation: 2,
        position: 'Grandfather (P)',
        birthYear: '2016',
        color: 'bg-gray-600',
        colorName: 'Blue',
        description: 'Foundation sire with legendary racing and breeding record.',
        achievements: 'Hall of Fame inductee, Multiple race champion'
      },
    },
    {
      id: 'mother_2_1', // Mother of father_1
      type: 'pigeonNode',
      position: { x: 800, y: 450 },
      data: {
        name: 'Silver Queen',
        owner: 'Jon Johnson',
        gender: 'female',
        generation: 2,
        position: 'Grandmother (P)',
        birthYear: '2017',
        color: 'bg-gray-400',
        colorName: 'Silver',
        description: 'Elite breeding hen from champion bloodlines.',
        achievements: 'Mother of champions, Proven genetics'
      },
    },
    {
      id: 'father_2_2', // Father of mother_1
      type: 'pigeonNode',
      position: { x: 800, y: 600 },
      data: {
        name: 'Golden Arrow',
        owner: 'Jon Johnson',
        gender: 'male',
        generation: 2,
        position: 'Grandfather (M)',
        birthYear: '2017',
        color: 'bg-yellow-600',
        colorName: 'Yellow',
        description: 'Fast racing pigeon with excellent navigation abilities.',
        achievements: 'Speed record holder, Long distance specialist'
      },
    },
    {
      id: 'mother_2_2', // Mother of mother_1
      type: 'pigeonNode',
      position: { x: 800, y: 750 },
      data: {
        name: 'Ruby Princess',
        owner: 'Jon Johnson',
        gender: 'female',
        generation: 2,
        position: 'Grandmother (M)',
        birthYear: '2018',
        color: 'bg-red-600',
        colorName: 'Red',
        description: 'Beautiful hen with strong racing instincts.',
        achievements: 'Regional champion, Excellent mother'
      },
    },

    // Generation 3 - Great-grandparents (8 pigeons) - Even further RIGHT
    {
      id: 'father_3_1', // Father of father_2_1
      type: 'pigeonNode',
      position: { x: 1150, y: 200 },
      data: {
        name: 'Thunder Bolt',
        owner: 'Jon Johnson',
        gender: 'male',
        generation: 3,
        position: 'Great-GF (PP)',
        birthYear: '2014',
        color: 'bg-indigo-600',
        colorName: 'Dark Blue',
        description: 'Legendary foundation bird.',
        achievements: 'Foundation sire'
      },
    },
    {
      id: 'mother_3_1', // Mother of father_2_1
      type: 'pigeonNode',
      position: { x: 1150, y: 300 },
      data: {
        name: 'Lightning Lady',
        owner: 'Jon Johnson',
        gender: 'female',
        generation: 3,
        position: 'Great-GM (PP)',
        birthYear: '2015',
        color: 'bg-purple-500',
        colorName: 'Purple',
        description: 'Fast racing hen with proven genetics.',
        achievements: 'Racing champion'
      },
    },
    {
      id: 'father_3_2', // Father of mother_2_1
      type: 'pigeonNode',
      position: { x: 1150, y: 400 },
      data: {
        name: 'Silver Storm',
        owner: 'Jon Johnson',
        gender: 'male',
        generation: 3,
        position: 'Great-GF (PM)',
        birthYear: '2015',
        color: 'bg-gray-500',
        colorName: 'Silver',
        description: 'Strong breeding cock.',
        achievements: 'Proven breeder'
      },
    },
    {
      id: 'mother_3_2', // Mother of mother_2_1
      type: 'pigeonNode',
      position: { x: 1150, y: 500 },
      data: {
        name: 'Pearl Beauty',
        owner: 'Jon Johnson',
        gender: 'female',
        generation: 3,
        position: 'Great-GM (PM)',
        birthYear: '2016',
        color: 'bg-slate-300',
        colorName: 'White',
        description: 'Beautiful white hen with excellent qualities.',
        achievements: 'Show winner'
      },
    },
    {
      id: 'father_3_3', // Father of father_2_2
      type: 'pigeonNode',
      position: { x: 1150, y: 600 },
      data: {
        name: 'Golden Eagle',
        owner: 'Jon Johnson',
        gender: 'male',
        generation: 3,
        position: 'Great-GF (MP)',
        birthYear: '2015',
        color: 'bg-yellow-700',
        colorName: 'Golden',
        description: 'Outstanding racing cock.',
        achievements: 'Multi-race winner'
      },
    },
    {
      id: 'mother_3_3', // Mother of father_2_2
      type: 'pigeonNode',
      position: { x: 1150, y: 700 },
      data: {
        name: 'Amber Star',
        owner: 'Jon Johnson',
        gender: 'female',
        generation: 3,
        position: 'Great-GM (MP)',
        birthYear: '2016',
        color: 'bg-amber-600',
        colorName: 'Amber',
        description: 'Exceptional breeding hen.',
        achievements: 'Mother of winners'
      },
    },
    {
      id: 'father_3_4', // Father of mother_2_2
      type: 'pigeonNode',
      position: { x: 1150, y: 800 },
      data: {
        name: 'Ruby King',
        owner: 'Jon Johnson',
        gender: 'male',
        generation: 3,
        position: 'Great-GF (MM)',
        birthYear: '2016',
        color: 'bg-red-700',
        colorName: 'Dark Red',
        description: 'Strong red cock with racing ability.',
        achievements: 'Regional winner'
      },
    },
    {
      id: 'mother_3_4', // Mother of mother_2_2
      type: 'pigeonNode',
      position: { x: 1150, y: 900 },
      data: {
        name: 'Crimson Rose',
        owner: 'Jon Johnson',
        gender: 'female',
        generation: 3,
        position: 'Great-GM (MM)',
        birthYear: '2017',
        color: 'bg-rose-600',
        colorName: 'Rose',
        description: 'Beautiful rose colored hen.',
        achievements: 'Quality breeder'
      },
    },

    // Generation 4 - Great-great-grandparents (16 pigeons) - RIGHTMOST
    // Father side of father_3_1
    {
      id: 'father_4_1',
      type: 'pigeonNode',
      position: { x: 1500, y: 100 },
      data: {
        name: 'Ancient King',
        owner: 'Jon Johnson',
        gender: 'male',
        generation: 4,
        position: 'GG-GF (1)',
        birthYear: '2012',
        color: 'bg-stone-700',
        colorName: 'Stone',
        description: 'Foundation bloodline patriarch.',
        achievements: 'Ancestral sire'
      },
    },
    {
      id: 'mother_4_1',
      type: 'pigeonNode',
      position: { x: 1500, y: 180 },
      data: {
        name: 'Royal Ancestor',
        owner: 'Jon Johnson',
        gender: 'female',
        generation: 4,
        position: 'GG-GM (1)',
        birthYear: '2013',
        color: 'bg-violet-600',
        colorName: 'Violet',
        description: 'Royal bloodline matriarch.',
        achievements: 'Foundation hen'
      },
    },
    // Mother side of father_3_1
    {
      id: 'father_4_2',
      type: 'pigeonNode',
      position: { x: 1500, y: 260 },
      data: {
        name: 'Storm Master',
        owner: 'Jon Johnson',
        gender: 'male',
        generation: 4,
        position: 'GG-GF (2)',
        birthYear: '2013',
        color: 'bg-slate-800',
        colorName: 'Dark',
        description: 'Master of storms.',
        achievements: 'Weather champion'
      },
    },
    {
      id: 'mother_4_2',
      type: 'pigeonNode',
      position: { x: 1500, y: 340 },
      data: {
        name: 'Wind Dancer',
        owner: 'Jon Johnson',
        gender: 'female',
        generation: 4,
        position: 'GG-GM (2)',
        birthYear: '2014',
        color: 'bg-cyan-500',
        colorName: 'Cyan',
        description: 'Graceful in flight.',
        achievements: 'Flight champion'
      },
    },
    // Father side of mother_3_1
    {
      id: 'father_4_3',
      type: 'pigeonNode',
      position: { x: 1500, y: 420 },
      data: {
        name: 'Silver Bullet',
        owner: 'Jon Johnson',
        gender: 'male',
        generation: 4,
        position: 'GG-GF (3)',
        birthYear: '2013',
        color: 'bg-gray-700',
        colorName: 'Silver',
        description: 'Fast as silver bullet.',
        achievements: 'Speed record'
      },
    },
    {
      id: 'mother_4_3',
      type: 'pigeonNode',
      position: { x: 1500, y: 500 },
      data: {
        name: 'Moon Beam',
        owner: 'Jon Johnson',
        gender: 'female',
        generation: 4,
        position: 'GG-GM (3)',
        birthYear: '2014',
        color: 'bg-slate-200',
        colorName: 'Light Gray',
        description: 'Gentle like moonbeam.',
        achievements: 'Beauty champion'
      },
    },
    // Mother side of mother_3_1
    {
      id: 'father_4_4',
      type: 'pigeonNode',
      position: { x: 1500, y: 580 },
      data: {
        name: 'Purple Rain',
        owner: 'Jon Johnson',
        gender: 'male',
        generation: 4,
        position: 'GG-GF (4)',
        birthYear: '2014',
        color: 'bg-purple-700',
        colorName: 'Deep Purple',
        description: 'Majestic purple cock.',
        achievements: 'Show winner'
      },
    },
    {
      id: 'mother_4_4',
      type: 'pigeonNode',
      position: { x: 1500, y: 660 },
      data: {
        name: 'Lavender Dream',
        owner: 'Jon Johnson',
        gender: 'female',
        generation: 4,
        position: 'GG-GM (4)',
        birthYear: '2015',
        color: 'bg-purple-400',
        colorName: 'Lavender',
        description: 'Dreamy lavender hen.',
        achievements: 'Breeding excellence'
      },
    },
    // Continue for remaining 8 great-great-grandparents...
    {
      id: 'father_4_5',
      type: 'pigeonNode',
      position: { x: 1500, y: 740 },
      data: {
        name: 'Golden Flash',
        owner: 'Jon Johnson',
        gender: 'male',
        generation: 4,
        position: 'GG-GF (5)',
        birthYear: '2013',
        color: 'bg-yellow-800',
        colorName: 'Gold',
        description: 'Flash of gold.',
        achievements: 'Racing legend'
      },
    },
    {
      id: 'mother_4_5',
      type: 'pigeonNode',
      position: { x: 1500, y: 820 },
      data: {
        name: 'Sunset Glory',
        owner: 'Jon Johnson',
        gender: 'female',
        generation: 4,
        position: 'GG-GM (5)',
        birthYear: '2014',
        color: 'bg-orange-500',
        colorName: 'Orange',
        description: 'Beautiful as sunset.',
        achievements: 'Beauty award'
      },
    },
    {
      id: 'father_4_6',
      type: 'pigeonNode',
      position: { x: 1500, y: 900 },
      data: {
        name: 'Ruby Storm',
        owner: 'Jon Johnson',
        gender: 'male',
        generation: 4,
        position: 'GG-GF (6)',
        birthYear: '2014',
        color: 'bg-red-800',
        colorName: 'Dark Ruby',
        description: 'Stormy red cock.',
        achievements: 'Storm champion'
      },
    },
    {
      id: 'mother_4_6',
      type: 'pigeonNode',
      position: { x: 1500, y: 980 },
      data: {
        name: 'Cherry Blossom',
        owner: 'Jon Johnson',
        gender: 'female',
        generation: 4,
        position: 'GG-GM (6)',
        birthYear: '2015',
        color: 'bg-pink-400',
        colorName: 'Cherry',
        description: 'Delicate cherry blossom.',
        achievements: 'Gentle mother'
      },
    },
    {
      id: 'father_4_7',
      type: 'pigeonNode',
      position: { x: 1500, y: 1060 },
      data: {
        name: 'Crimson Knight',
        owner: 'Jon Johnson',
        gender: 'male',
        generation: 4,
        position: 'GG-GF (7)',
        birthYear: '2014',
        color: 'bg-red-900',
        colorName: 'Crimson',
        description: 'Noble crimson knight.',
        achievements: 'Noble bloodline'
      },
    },
    {
      id: 'mother_4_7',
      type: 'pigeonNode',
      position: { x: 1500, y: 1140 },
      data: {
        name: 'Rose Garden',
        owner: 'Jon Johnson',
        gender: 'female',
        generation: 4,
        position: 'GG-GM (7)',
        birthYear: '2015',
        color: 'bg-rose-500',
        colorName: 'Rose',
        description: 'Beautiful as rose garden.',
        achievements: 'Garden of beauty'
      },
    },
    {
      id: 'father_4_8',
      type: 'pigeonNode',
      position: { x: 1500, y: 1220 },
      data: {
        name: 'Scarlet Warrior',
        owner: 'Jon Johnson',
        gender: 'male',
        generation: 4,
        position: 'GG-GF (8)',
        birthYear: '2015',
        color: 'bg-red-700',
        colorName: 'Scarlet',
        description: 'Brave scarlet warrior.',
        achievements: 'Warrior spirit'
      },
    },
    {
      id: 'mother_4_8',
      type: 'pigeonNode',
      position: { x: 1500, y: 1300 },
      data: {
        name: 'Coral Queen',
        owner: 'Jon Johnson',
        gender: 'female',
        generation: 4,
        position: 'GG-GM (8)',
        birthYear: '2016',
        color: 'bg-coral-500',
        colorName: 'Coral',
        description: 'Regal coral queen.',
        achievements: 'Queenly grace'
      },
    }
  ];

  // Reversed edge connections - now flowing from LEFT to RIGHT
  const initialEdges = [
    // Subject to Parents (LEFT to RIGHT direction)
    { id: 'subject-father_1', source: 'subject', target: 'father_1', type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 3 }, animated: true },
    { id: 'subject-mother_1', source: 'subject', target: 'mother_1', type: 'smoothstep', style: { stroke: '#ec4899', strokeWidth: 3 }, animated: true },
    
    // Parents to Grandparents
    { id: 'father_1-father_2_1', source: 'father_1', target: 'father_2_1', type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 2.5 } },
    { id: 'father_1-mother_2_1', source: 'father_1', target: 'mother_2_1', type: 'smoothstep', style: { stroke: '#ec4899', strokeWidth: 2.5 } },
    { id: 'mother_1-father_2_2', source: 'mother_1', target: 'father_2_2', type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 2.5 } },
    { id: 'mother_1-mother_2_2', source: 'mother_1', target: 'mother_2_2', type: 'smoothstep', style: { stroke: '#ec4899', strokeWidth: 2.5 } },
    
    // Grandparents to Great-grandparents
    { id: 'father_2_1-father_3_1', source: 'father_2_1', target: 'father_3_1', type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 2 } },
    { id: 'father_2_1-mother_3_1', source: 'father_2_1', target: 'mother_3_1', type: 'smoothstep', style: { stroke: '#ec4899', strokeWidth: 2 } },
    { id: 'mother_2_1-father_3_2', source: 'mother_2_1', target: 'father_3_2', type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 2 } },
    { id: 'mother_2_1-mother_3_2', source: 'mother_2_1', target: 'mother_3_2', type: 'smoothstep', style: { stroke: '#ec4899', strokeWidth: 2 } },
    { id: 'father_2_2-father_3_3', source: 'father_2_2', target: 'father_3_3', type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 2 } },
    { id: 'father_2_2-mother_3_3', source: 'father_2_2', target: 'mother_3_3', type: 'smoothstep', style: { stroke: '#ec4899', strokeWidth: 2 } },
    { id: 'mother_2_2-father_3_4', source: 'mother_2_2', target: 'father_3_4', type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 2 } },
    { id: 'mother_2_2-mother_3_4', source: 'mother_2_2', target: 'mother_3_4', type: 'smoothstep', style: { stroke: '#ec4899', strokeWidth: 2 } },
    
    // Great-grandparents to Great-great-grandparents
    { id: 'father_3_1-father_4_1', source: 'father_3_1', target: 'father_4_1', type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 1.5 } },
    { id: 'father_3_1-mother_4_1', source: 'father_3_1', target: 'mother_4_1', type: 'smoothstep', style: { stroke: '#ec4899', strokeWidth: 1.5 } },
    { id: 'mother_3_1-father_4_2', source: 'mother_3_1', target: 'father_4_2', type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 1.5 } },
    { id: 'mother_3_1-mother_4_2', source: 'mother_3_1', target: 'mother_4_2', type: 'smoothstep', style: { stroke: '#ec4899', strokeWidth: 1.5 } },
    { id: 'father_3_2-father_4_3', source: 'father_3_2', target: 'father_4_3', type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 1.5 } },
    { id: 'father_3_2-mother_4_3', source: 'father_3_2', target: 'mother_4_3', type: 'smoothstep', style: { stroke: '#ec4899', strokeWidth: 1.5 } },
    { id: 'mother_3_2-father_4_4', source: 'mother_3_2', target: 'father_4_4', type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 1.5 } },
    { id: 'mother_3_2-mother_4_4', source: 'mother_3_2', target: 'mother_4_4', type: 'smoothstep', style: { stroke: '#ec4899', strokeWidth: 1.5 } },
    { id: 'father_3_3-father_4_5', source: 'father_3_3', target: 'father_4_5', type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 1.5 } },
    { id: 'father_3_3-mother_4_5', source: 'father_3_3', target: 'mother_4_5', type: 'smoothstep', style: { stroke: '#ec4899', strokeWidth: 1.5 } },
    { id: 'mother_3_3-father_4_6', source: 'mother_3_3', target: 'father_4_6', type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 1.5 } },
    { id: 'mother_3_3-mother_4_6', source: 'mother_3_3', target: 'mother_4_6', type: 'smoothstep', style: { stroke: '#ec4899', strokeWidth: 1.5 } },
    { id: 'father_3_4-father_4_7', source: 'father_3_4', target: 'father_4_7', type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 1.5 } },
    { id: 'father_3_4-mother_4_7', source: 'father_3_4', target: 'mother_4_7', type: 'smoothstep', style: { stroke: '#ec4899', strokeWidth: 1.5 } },
    { id: 'mother_3_4-father_4_8', source: 'mother_3_4', target: 'father_4_8', type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 1.5 } },
    { id: 'mother_3_4-mother_4_8', source: 'mother_3_4', target: 'mother_4_8', type: 'smoothstep', style: { stroke: '#ec4899', strokeWidth: 1.5 } }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const defaultViewport = { x: 0, y: 0, zoom: 0.5 };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
     

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultViewport={defaultViewport}
        fitView
        attributionPosition="bottom-right"
        className="bg-transparent"
        minZoom={0.1}
        maxZoom={1.5}
      >
        <Controls 
          className="bg-white shadow-lg rounded-lg border border-slate-200"
          showInteractive={false}
        />
        <MiniMap 
          className="bg-white shadow-lg rounded-lg border border-slate-200 overflow-hidden"
          nodeColor={(node) => {
            switch (node.data.generation) {
              case 0: return '#fbbf24'; // Subject - Yellow
              case 1: return '#3b82f6'; // Parents - Blue  
              case 2: return '#10b981'; // Grandparents - Green
              case 3: return '#8b5cf6'; // Great-grandparents - Purple
              case 4: return '#f97316'; // Great-great-grandparents - Orange
              default: return '#6b7280';
            }
          }}
          maskColor="rgba(255, 255, 255, 0.8)"
        />
        <Background 
          variant="dots" 
          gap={25} 
          size={1.5} 
          color="#cbd5e1"
        />
      </ReactFlow>
    </div>
  );
}