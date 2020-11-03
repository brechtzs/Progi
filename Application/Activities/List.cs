﻿using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<ActivityDTO>> { }

        public class Handler : IRequestHandler<Query, List<ActivityDTO>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<List<ActivityDTO>> Handle(Query request, 
                CancellationToken cancellationToken)
            {
                var activities = await _context.Activities
                    .ToListAsync();
                
                return _mapper.Map<List<Activity>, List<ActivityDTO>>(activities);
            }
        }
    }
}
